// App requirements
const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// Define app using express
const app = express();

// Connect use of bodyParser, ejs, and mongoose
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/mentorMatchDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

// User database set up
const userSchema = new mongoose.Schema({
  classification: String,
  password: String,
  firstName: String,
  lastName: String,
  username: String,
  phone: String,
  location: String,
  country: String,
  division: String,
  department: String,
  level: String,
  yearsWithCompany: String,
  yearsCurrentPosition: String,
  areasForDev: Array,
  areasOfExp: Array,
  languages: Array,
  education: String,
  certifications: String,
  communityService: String,
  linkedin: String,
  whyJoin: String,
  mentorshipProcess: String,
  goals: String,
  terms: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======= Routes ========
// Home route
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("form");
});

app.post("/register", function (req, res) {
  User.register({
      classification: req.body.classification,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      phone: req.body.phone,
      location: req.body.location,
      country: req.body.country,
      division: req.body.division,
      department: req.body.department,
      level: req.body.level,
      yearsWithCompany: req.body.yearsWithCompany,
      yearsCurrentPosition: req.body.yearsCurrentPosition,
      areasForDev: req.body.areasForDevelopment,
      areasOfExp: req.body.areasOfExpertise,
      languages: req.body.languages,
      education: req.body.education,
      certifications: req.body.certifications,
      communityService: req.body.communityService,
      linkedin: req.body.linkedin,
      whyJoin: req.body.whyJoin,
      mentorshipProcess: req.body.communicationMethod,
      goals: req.body.goals,
      terms: req.body.terms,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/personal-info");
        });
      }
    }
  );
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/personal-info");
      });
    }
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/personal-info", function (req, res) {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      res.render("personal_info", {
        classification: foundUser.classification,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        username: foundUser.username,
        phone: foundUser.phone,
        location: foundUser.location,
        country: foundUser.country,
        division: foundUser.division,
        department: foundUser.department,
        level: foundUser.level,
        yearsWithCompany: foundUser.yearsWithCompany,
        yearsCurrentPosition: foundUser.yearsCurrentPosition,
        areasForDev: foundUser.areasForDev,
        areasOfExp: foundUser.areasOfExp,
        languages: foundUser.languages,
        education: foundUser.education,
        certifications: foundUser.certifications,
        communityService: foundUser.communityService,
        linkedin: foundUser.linkedin,
        whyJoin: foundUser.whyJoin,
        mentorshipProcess: foundUser.mentorshipProcess,
        goals: foundUser.goals,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/matches", function (req, res) {
  res.render("matches");
});

app.get("/match-profile-view", function (req, res) {
  res.render("match_profile_view");
});

app.get("/search", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("search");
  } else {
    res.redirect("/login");
  }
});

app.post("/search", function (req, res) {
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
      $in: req.body.areasForDev
    };
  }

  if (req.body.areasOfExp) {
    query.areasOfExp = {
      $in: req.body.areasOfExp
    };
  }

  if (req.body.languages) {
    query.languages = {
      $in: req.body.languages
    };
  }

  console.log(query);

  User.find(query, function (err, results) {
    if (err) {
      res.send(err);
      console.log(err);
    } else if (results.length > 1) {
      res.render("search_results", {
        results: results,
      });
    } else {
      res.render("search_results_not_found")
    }
  });
});

app.get("/profile/:userId", function (req, res) {
  if (req.isAuthenticated()) {
    const requestedUserId = req.params.userId
    console.log(typeof requestedUserId);

    User.findOne({
      _id: requestedUserId
    }, function (err, user) {
      if (err) {
        res.send(err);
        console.log(err);
      } else {
        console.log(user);
        res.render("profile_view", {
          user: user,
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// app.get("/profile/:userId", function (req, res) {
//   const requestedUserId = req.params.userId;

//   Mentee.findOne({ _id: requestedUserId }, function (err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("profile", {
//         firstName: result.firstName,
//         lastName: result.lastName,
//         email: result.email,
//         phone: result.phone,
//         location: result.location,
//         country: result.country,
//         division: result.division,
//         department: result.department,
//         level: result.level,
//         yearsWithCompany: result.yearsWithCompany,
//         yearsCurrentPosition: result.yearsCurrentPosition,
//         areasForDev: result.areasForDev,
//         languages: result.languages,
//         education: result.education,
//         certifications: result.certifications,
//         communityService: result.communityService,
//         whyMentee: result.whyMentee,
//         mentorshipProcess: result.mentorshipProcess,
//         goals: result.goals,
//       });
//     }
//   });
// });

// app.post("/menteeForm", function (req, res) {
//   const newMentee = new Mentee({
//     username: req.body.username,
//     password: req.body.password,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     phone: req.body.phone,
//     location: req.body.location,
//     country: req.body.country,
//     division: req.body.division,
//     department: req.body.department,
//     level: req.body.level,
//     yearsWithCompany: req.body.yearsWithCompany,
//     yearsCurrentPosition: req.body.yearsCurrentPosition,
//     areasForDev: req.body.areasForDevelopment,
//     languages: req.body.languages,
//     education: req.body.education,
//     certifications: req.body.certifications,
//     communityService: req.body.communityService,
//     linkedin: req.body.linkedin,
//     whyMentee: req.body.whyMentee,
//     mentorshipProcess: req.body.communicationMethod,
//     goals: req.body.goals,
//     terms: req.body.terms,
//   });

//   newMentee.save(function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect("/profile");
//       console.log("New mentee was saved successfully.");
//     }
//   });
// });

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000.");
});