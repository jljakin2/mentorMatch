const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");

exports.adminCode = (req, res) => {
    res.render("adminCode", {title: "Admin Code"});
};

