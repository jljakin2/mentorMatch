const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({
        message: "That filetype isn't allowed!"
      }, false);
    }
  },
};

exports.homePage = (req, res) => {
  res.render("home", {
    title: "Home",
  });
};

exports.registerForm = (req, res) => {
  res.render("register", {
    title: "Registration Form",
  });
};

exports.upload = multer(multerOptions).single("profilePicture");

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    return next(); // skip to the next middleware
  }

  // get extension of file from mimetype and change file name to unique identifier
  const extension = req.file.mimetype.split("/")[1];
  req.body.profilePicture = `${uuid.v4()}.${extension}`;

  // resizing of image
  const profilePicture = await jimp.read(req.file.buffer);
  await profilePicture.write(`./public/uploads/${req.body.profilePicture}`);
  await profilePicture.resize(800, jimp.AUTO);

  //once we have written the photo to our filesystem, keep going!
  next();
};

// middleware to validate user's input on the sign up form on the server side. We also have front end validators
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody("firstName");
  req.checkBody("firstName", "You must supply a first name!").notEmpty();
  req.sanitizeBody("lastName");
  req.checkBody("lastName", "You must supply a last name!").notEmpty();
  req.sanitizeBody("email");
  req.checkBody("email", "That email is not valid!").isEmail();
  req.checkBody("password", "Password cannot be blank!").notEmpty();
  req
    .checkBody("confirm-password", "Confirmed password cannot be blank!")
    .notEmpty();
  req
    .checkBody("confirm-password", "Oops! Your passwords do not match")
    .equals(req.body.password);

  const errors = req.validationErrors();
  // if there were any errors, notify user with flash and return them to register page with content they
  // already completed filled in by using the "body" variable
  if (errors) {
    req.flash(
      "error",
      errors.map((err) => err.msg)
    );
    res.render("register", {
      title: "Registration Form",
      body: req.body,
      flashes: req.flash(),
    });
    return; // stop fn from running
  }
  next(); // there weren't any errors!
};

exports.register = async (req, res, next) => {
  const user = new User({
    classification: req.body.classification,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    country: req.body.country,
    division: req.body.division,
    department: req.body.department,
    level: req.body.level,
    yearsWithCompany: req.body.yearsWithCompany,
    yearsCurrentPosition: req.body.yearsWithCompany,
    areas: req.body.areas,
    languages: req.body.languages,
    education: req.body.education,
    certifications: req.body.certifications,
    communityService: req.body.communityService,
    linkedin: req.body.linkedin,
    whyMentor: req.body.whyMentor,
    whyMentee: req.body.whyMentee,
    mentorshipProcess: req.body.mentorshipProcess,
    goals: req.body.goals,
    profilePicture: req.body.profilePicture,
    terms: req.body.terms
  });

  const register = promisify(User.register, User);
  await register(user, req.body.password)

  next(); // pass to authController.login
};

exports.welcome = (req, res) => {
  res.render("welcome", {
    title: "Welcome"
  });
}

exports.getAccount = async (req, res) => {
  const account = await (await User.findOne({slug: req.params.slug})).populate("requests");
  res.render("account", {title: `${account.firstName}'s Account`, account});
}

exports.editAccount = (req, res) => {
  res.render("editAccount", {
    title: "Edit Profile"
  })
}

exports.updateAccount = async (req, res) => {

  const user = await User.findOneAndUpdate({
    _id: req.user._id
  },
    req.body,
  {
    new: true,
    runValidators: true,
    context: "query"
  }).exec();

  req.flash("success", "You have successfully updated your profile!")
  res.redirect(`/account/${user.slug}`)
}

exports.searchForm = (req, res) => {
  res.render("search", {title: "Search"});
};

exports.searchResults = async (req, res) => {
  const query = {};

  if (req.body.classification) {
      query.classification = req.body.classification;
  }

  if (req.body.firstName) {
    query.firstName = {
      $regex: req.body.firstName,
      $options: "i",
    };
  }

  if (req.body.lastName) {
    query.lastName = {
      $regex: req.body.lastName,
      $options: "i",
    };
  }

  if (req.body.location) {
    query.location = req.body.location;
  }

  if (req.body.country) {
    query.country = req.body.country;
  }

  if (req.body.division) {
    query.division = req.body.division;
  }

  if (req.body.department) {
    query.department = req.body.department;
  }

  if (req.body.level) {
    query.level = req.body.level;
  }

  if (req.body.yearsWithCompany) {
    query.yearsWithCompany = req.body.yearsWithCompany;
  }

  if (req.body.yearsCurrentPosition) {
    query.yearsCurrentPosition = yearsCurrentPosition;
  }

  if (req.body.education) {
    query.education = req.body.education;
  }

  if (req.body.areasForDev) {
    query.areasForDev = {
      $in: req.body.areasForDev,
    };
  }

  if (req.body.areasOfExp) {
    query.areasOfExp = {
      $in: req.body.areasOfExp,
    };
  }

  if (req.body.languages) {
    query.languages = {
      $in: req.body.languages,
    };
  }

  const results = await User.find(query).exec()

  if (results) {
    res.render("search_results", {title: "Search Results", results})
  } else {
    res.render("search_results_not_found", {title: "No Results"})
  }
}