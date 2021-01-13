const passport = require("passport");
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
      next(
        {
          message: "That filetype isn't allowed!",
        },
        false
      );
    }
  },
};

exports.homePage = (req, res) => {
  // checks to see if user is logged in so when they go to the home route, they are redirected to their dashboard home
  if (req.isAuthenticated()) {
    res.redirect("/welcome");
  } else {
    res.render("home", {
      title: "Home",
    });
  }
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

exports.yesToTerms = (req, res, next) => {
  console.log(req.body.terms);
  if (req.body.terms !== "yes") {
    req.flash(
      "error",
      "You must agree to the terms of use in order to use the platform."
    );
    res.render("register", {
      title: "Registration Form",
      body: req.body,
      flashes: req.flash(),
    });
  } else {
    return next();
  }
};

exports.atLeastSL1 = (req, res, next) => {
  if (
    (req.body.level === "E4 - Sr. Level Associate" ||
      req.body.level === "E2 - E3 Associate" ||
      req.body.level === "N2 - N4 Associate") &&
    req.body.classification === "Mentor"
  ) {
    req.flash("error", "You must be an SL1+ to register as a mentor.");
    res.render("register", {
      title: "Registration Form",
      body: req.body,
      flashes: req.flash(),
    });
  } else {
    return next();
  }
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
    terms: req.body.terms,
  });

  const register = promisify(User.register, User);
  await register(user, req.body.password);

  next(); // pass to authController.login
};

exports.welcome = (req, res) => {
  res.render("welcome", {
    title: "Welcome",
  });
};

exports.whichCountry = async (req, res, next) => {
  const mexico = ["Mexico"];
  const northern = ["USA", "Canada"];

  const account = await User.findOne({ slug: req.params.slug });

  if (
    (req.user.country === "Mexico" && mexico.includes(account.country)) ||
    (northern.includes(req.user.country) && northern.includes(account.country))
  ) {
    next();
  } else {
    req.flash(
      "error",
      "The user you are looking for isn't part of your country's version of Mentor Match."
    );
    res.redirect("/welcome");
  }
};

exports.getAccount = async (req, res) => {
  const fullPreUserRequests = await User.findOne({
    _id: req.user._id,
  }).populate("requests");
  const fullUserRequests = fullPreUserRequests.requests;

  const account = await User.findOne({ slug: req.params.slug }).populate(
    "requests"
  );

  res.render("account", {
    title: `${account.firstName}'s Account`,
    account,
    fullUserRequests,
  });
};

exports.editAccount = (req, res) => {
  res.render("editAccount", {
    title: "Edit Profile",
  });
};

exports.updateAccount = async (req, res) => {
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  ).exec();

  req.flash("success", "You have successfully updated your profile!");
  res.redirect(`/account/${user.slug}`);
};

exports.searchForm = (req, res) => {
  res.render("search", { title: "Search" });
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
  } else {
    if (req.user.country === "Mexico") {
      query.country = "Mexico";
    } else {
      query.country = { $in: ["USA", "Canada"] };
    }
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

  if (req.body.areas) {
    if (req.body.areas.length > 1) {
      query.areas = {
        $all: req.body.areas,
      };
    } else if (req.body.areas.length === 1) {
      query.areas = req.body.areas;
    }
  }

  if (req.body.languages) {
    if (req.body.languages.length > 1) {
      query.languages = {
        $all: req.body.languages,
      };
    } else if (req.body.languages.length === 1) {
      query.languages = req.body.languages;
    }
  }

  const results = await User.find(query);

  const resultsCount = results.length;

  if (resultsCount > 0) {
    res.render("search_results", { title: "Search Results", results });
  } else {
    res.render("search_results_not_found", { title: "No Results" });
  }
};

exports.findTopMatches = async (req, res) => {
  const scoredMatches = [];

  // const account = await User.findOne({slug: req.params.slug, country: "Mexico"}).populate("requests");
  // res.render("account", {title: `${account.firstName}'s Account`, account, fullUserRequests});
  // const account = await User.findOne({slug: req.params.slug, country: {$in: ["USA", "Canada"]}}).populate("requests");

  if (req.user.classification === "Mentee") {
    const currentMentee = await User.findOne({ _id: req.user._id });
    const matchingMentors = await User.find({
      classification: "Mentor",
      country:
        req.user.country === "Mexico" ? "Mexico" : { $in: ["USA", "Canada"] },
    });

    // loop through each user in db
    matchingMentors.forEach((matchingMentor) => {
      let score = 0;

      // loop through each area in the looped user document
      matchingMentor.areas.forEach((area) => {
        // for each area in the user's areas list, check if the area matches
        if (currentMentee.areas.includes(area)) {
          score += 3;
        }
      });

      let mentorAndScore = {
        person: matchingMentor,
        score: score,
      };

      scoredMatches.push(mentorAndScore);
    });
  } else {
    const currentMentor = await User.findOne({ _id: req.user._id });
    const matchingMentees = await User.find({
      classification: "Mentee",
      country:
        req.user.country === "Mexico" ? "Mexico" : { $in: ["USA", "Canada"] },
    });

    // loop through each user in db
    matchingMentees.forEach((matchingMentee) => {
      let score = 0;

      // loop through each area in the looped user document
      matchingMentee.areas.forEach((area) => {
        // for each area in the user's areas list, check if the area matches
        if (currentMentor.areas.includes(area)) {
          score += 3;
        }
      });

      let menteeAndScore = {
        person: matchingMentee,
        score: score,
      };

      scoredMatches.push(menteeAndScore);
    });
  }

  // sort matches in descending order based on the score
  const sortedMatches = scoredMatches.sort(function (a, b) {
    return b.score - a.score;
  });

  const matches = sortedMatches.slice(0, 10);

  res.render("top_matches", { title: "Top Matches", matches });
};

exports.getResources = async (req, res) => {
  res.render("resources", { title: "Resources" });
};
