const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/menteeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const menteeSchema = {
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  location: String,
  country: String,
  division: String,
  department: String,
  level: String,
  yearsWithCompany: String,
  yearsCurrentPosition: String,
  areasForDev: Array,
  languages: Array,
  education: String,
  certifications: String,
  communityService: String,
  linkedin: String,
  whyMentee: String,
  mentorshipProcess: String,
  goals: String,
  terms: String,
};

const Mentee = new mongoose.model("Mentee", menteeSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/command-center", function (req, res) {
  res.render("command_home");
});

app.get("/personal-info", function (req, res) {
  res.render("personal_info");
});

app.get("/matches", function (req, res) {
  res.render("matches");
});

app.get("/profile-view", function (req, res) {
  res.render("profile_view");
});

app.get("/search", function (req, res) {
  res.render("search");
});

app.get("/profile/:userId", function (req, res) {
  const requestedUserId = req.params.userId;

  Mentee.findOne({ _id: requestedUserId }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile", {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        phone: result.phone,
        location: result.location,
        country: result.country,
        division: result.division,
        department: result.department,
        level: result.level,
        yearsWithCompany: result.yearsWithCompany,
        yearsCurrentPosition: result.yearsCurrentPosition,
        areasForDev: result.areasForDev,
        languages: result.languages,
        education: result.education,
        certifications: result.certifications,
        communityService: result.communityService,
        whyMentee: result.whyMentee,
        mentorshipProcess: result.mentorshipProcess,
        goals: result.goals,
      });
    }
  });
});

app.get("/menteeForm", function (req, res) {
  res.render("menteeForm");
});

app.get("/mentorForm", function (req, res) {
  res.render("mentorForm");
});

app.get("/combinedForm", function (req, res) {
  res.render("combinedForm");
});

app.post("/menteeForm", function (req, res) {
  const newMentee = new Mentee({
    username: req.body.username,
    password: req.body.password,
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
    yearsCurrentPosition: req.body.yearsCurrentPosition,
    areasForDev: req.body.areasForDevelopment,
    languages: req.body.languages,
    education: req.body.education,
    certifications: req.body.certifications,
    communityService: req.body.communityService,
    linkedin: req.body.linkedin,
    whyMentee: req.body.whyMentee,
    mentorshipProcess: req.body.communicationMethod,
    goals: req.body.goals,
    terms: req.body.terms,
  });

  newMentee.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/profile");
      console.log("New mentee was saved successfully.");
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000.");
});
