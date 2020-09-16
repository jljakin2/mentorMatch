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

// Request db schema set up and initiation
const requestsSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Number,
      enums: [
        0, //'rejected',
        1, //'pending',
        2, //'accepted',
      ],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Request = new mongoose.model("Request", requestsSchema);

// User database set up
const userSchema = new mongoose.Schema(
  {
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
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
  },
  {
    timestamps: true,
  }
);

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
  User.register(
    {
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
    User.findById(req.user.id, function (err, user) {
      res.render("personal_info", {
        user: user,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/request/:userId", function (req, res) {
  const newRequest = new Request({
    requester: req.user._id,
    recipient: req.params.userId,
    status: 1,
  });

  newRequest.save(function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("request saved successfully.");
    }
  });

  User.updateOne(
    {
      _id: req.params.userId,
    },
    {
      $push: {
        requests: newRequest,
      },
    },
    function (err, success) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(success);
      }
    }
  );

  User.updateOne(
    {
      _id: req.user._id,
    },
    {
      $push: {
        requests: newRequest,
      },
    },
    function (err, success) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(success);
      }
    }
  );

  res.status(204).send();
});

app.post("/accept/:userId", function (req, res) {
  Request.find({ recipient: req.user._id, status: 2 }, function (err, results) {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      if (results.length === 0) {
        Request.updateOne(
          { requester: req.params.userId, recipient: req.user._id },
          { status: 2 },
          function (err, success) {
            if (err) {
              res.send(err);
              console.log(err);
            } else {
              console.log(success);
            }
          }
        );
        res.status(204).send();
      } else {
        res.render("max_accepted");
      }
    }
  });
});

app.post("/decline/:userId", function (req, res) {
  Request.updateOne(
    { requester: req.params.userId, recipient: req.user._id },
    { status: 0 },
    function (err, success) {
      if (err) {
        res.send(err);
        console.log(err);
      } else {
        console.log(success);
      }
    }
  );
  res.status(204).send();
});

app.get("/requests", function (req, res) {
  if (req.isAuthenticated) {
    if (req.user.classification === "mentee") {
      Request.find({
        requester: req.user._id,
      })
        .populate("recipient")
        .exec(function (err, result) {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            res.render("requests", {
              requests: result,
              currentUser: req.user,
            });
          }
        });
    } else {
      Request.find({
        recipient: req.user._id,
      })
        .populate("requester")
        .exec(function (err, result) {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            res.render("requests", {
              requests: result,
              currentUser: req.user,
            });
          }
        });
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/profile/:userId", function (req, res) {
  if (req.isAuthenticated()) {
    const requestedUserId = mongoose.Types.ObjectId(req.params.userId);

    User.findOne({
      _id: requestedUserId,
    })
      .populate("requests")
      .exec(function (err, user) {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.render("profile_view", {
            user: user,
            currentUser: req.user,
          });
        }
      });
  } else {
    res.redirect("/login");
  }
});

app.get("/matches", function (req, res) {
  res.render("matches");
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

  User.find(query)
    .populate("requests")
    .exec(function (err, results) {
      if (err) {
        res.send(err);
        console.log(err);
      } else if (results.length >= 1) {
        res.render("search_results", {
          results: results,
          currentUser: req.user,
        });
      } else {
        res.render("search_results_not_found");
      }
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000.");
});

// ======= Helpful Functions ========
