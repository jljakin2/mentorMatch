const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {
    urlencoded
} = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/profile", function (req, res) {
    res.render("profile");
})

app.get("/menteeForm", function (req, res) {
    res.render("menteeForm");
});

app.get("/mentorForm", function (req, res) {
    res.render("mentorForm");
});

app.get("/combinedForm", function (req, res) {
    res.render("combinedForm");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server running on port 3000.");
});