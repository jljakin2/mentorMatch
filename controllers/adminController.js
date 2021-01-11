const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Request = mongoose.model("Request");
const promisify = require("es6-promisify");
const ObjectsToCsv = require("objects-to-csv");
const fs = require("fs");
const stringify = require("csv-stringify");

// checks to see if the user is an admin
exports.isAdmin = (req, res, next) => {
  // first check if the user is an admin
  if (req.user.isAdmin) {
    return next(); // carry on! They are an admin
  }

  req.flash("error", "Oops you must be an admin to access that page!");
  res.redirect("/");
};

exports.adminNav = (req, res) => {
  res.render("adminNav", { title: "Admin Home" });
};

// gets list of all participants
exports.participants = async (req, res) => {
  const participants = await User.find();

  console.log(typeof JSON.stringify(participants));

  res.render("participants", { title: "Participants", participants });
};

exports.removeAdmin = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { isAdmin: false },
    { new: true }
  );

  req.flash("success", "Admin rights have been successfully removed.");
  res.redirect("/admin/participants");
};

exports.addAdmin = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { isAdmin: true },
    { new: true }
  );

  req.flash("success", "Admin rights have been successfully granted.");
  res.redirect("/admin/participants");
};

exports.removeUser = async (req, res) => {
  const removedUser = await User.deleteOne({ _id: req.params.id });
  const removedConnection = await Request.deleteOne({
    $or: [{ mentee: req.params.id }, { mentor: req.params.id }],
  });

  req.flash("success", "User has been successfully removed.");
  res.redirect("/admin/participants");
};

exports.currentConnections = async (req, res) => {
  const connections = await Request.find({ status: 2 })
    .populate("mentee")
    .populate("mentor");

  res.render("currentConnections", {
    title: "Current Connections",
    connections,
  });
};

exports.addManualConnection = (req, res) => {
  res.render("manualConnection", { title: "Add Manual Connection" });
};

// TODO: do we want to add middleware that checks for mentee/mentor dependencies?
exports.manuallyAdd = async (req, res) => {
  const mentee = await User.findOne({ email: req.body.menteeEmail });
  const mentor = await User.findOne({ email: req.body.mentorEmail });

  const newConnection = await new Request({
    status: 2,
    mentee: mentee._id,
    mentor: mentor._id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }).save();

  req.flash("success", "Connection has been successfully created!");
  res.redirect("/admin/add-manual-connection");
};

exports.gapAnalysis = async (req, res) => {
  const mentees = await User.find({ classification: "Mentee" });
  const mentors = await User.find({ classification: "Mentor" });

  // Function to create sorted frequency table for all skill areas in mentor and mentees
  const skillFreqTable = (classifications) => {
    let cSkills = {};

    classifications.forEach((c) => {
      const skills = c.areas;

      skills.forEach((skill) => {
        if (!cSkills.hasOwnProperty(skill)) {
          cSkills[skill] = 0;
        } else {
          cSkills[skill] = cSkills[skill] + 1;
        }
      });
    });

    const orderedSkills = Object.keys(cSkills)
      .sort()
      .reduce((obj, key) => {
        obj[key] = cSkills[key];
        return obj;
      }, {});

    // const sorted = Object.entries(cSkills).sort((a, b) => {
    //   return b[1] - a[1];
    // });

    // let cSkillFinal = {};

    // sorted.forEach((pair) => {
    //   cSkillFinal[pair[0]] = pair[1];
    // });

    return orderedSkills;
  };

  // function that takes mentee and mentor areas and finds the largest gaps between what mentees need and what mentors can offer
  const findGaps = (menteeAreas, mentorAreas) => {
    const menteeKeys = Object.keys(menteeAreas);
    const mentorKeys = Object.keys(mentorAreas);

    let gapAreas = {};

    menteeKeys.forEach((key) => {
      const diff = menteeAreas[key] - mentorAreas[key];
      gapAreas[key] = diff;
    });

    const sorted = Object.entries(gapAreas).sort((a, b) => {
      return b[1] - a[1];
    });

    let sortedGapAreas = {};

    sorted.forEach((pair) => {
      sortedGapAreas[pair[0]] = pair[1];
    });

    return sortedGapAreas;
  };

  // Get mentee areas
  const menteeAreas = skillFreqTable(mentees);
  const menteeData = Object.values(menteeAreas);

  // Get mentor areas
  const mentorAreas = skillFreqTable(mentors);
  const mentorData = Object.values(mentorAreas);

  // Find largest gaps between what mentees are looking for and what mentors can offer
  const finalGaps = findGaps(menteeAreas, mentorAreas);

  res.render("gapAnalysis", {
    title: "Gap Analysis",
    menteeAreas,
    mentorAreas,
    finalGaps,
    menteeData,
    mentorData,
  });
};
