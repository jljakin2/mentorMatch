const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require("validator");
const slug = require("slugs");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

// Schema structure
const userSchema = new mongoose.Schema({
    classification: {
        type: String,
        default: "Mentee"
    },
    firstName: {
        type: String,
        trim: true,
        required: "Please supply your first name."
    },
    lastName: {
        type: String,
        trim: true,
        required: "Please supply your last name."
    },
    slug: String,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Invalid Email Address"], // use the validator package to ensure we are checking validation on the server side
        required: "Please supply and email address."
    },
    phone: {
        type: String,
        trim: true,
        required: "Please supply a phone number."
    },
    location: {
        type: String,
        required: "Please supply a location."
    },
    country: {
        type: String,
        required: "Please supply a country."
    },
    division: {
        type: String,
        required: "Please supply a division."
    },
    department: {
        type: String,
        required: "Please supply a department."
    },
    level: {
        type: String,
        required: "Please supply a career level."
    },
    yearsWithCompany: {
        type: String,
        required: "Please supply a value."
    },
    yearsCurrentPosition: {
        type: String,
        required: "Please supply a value."
    },
    areas: [{
        type: String,
        required: "Please supply areas for either development or expertise."
    }],
    languages: [{
        type: String,
        required: "Please supply the language(s) you speak."
    }],
    education: {
        type: String,
        required: "Please supply education level."
    },
    certifications: {
        type: String,
        trim: true
    },
    communityService: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    whyMentor: {
        type: String,
        trim: true
    },
    whyMentee: {
        type: String,
        trim: true
    },
    mentorshipProcess: {
        type: String,
        trim: true
    },
    goals: {
        type: String,
        trim: true
    },
    terms: {
        type: String,
        required: "Please indicate whether or not you agree with the terms of use."
    },
    profilePicture: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
      }],
}, {
    timestamps: true,
});

// Passport middleware
userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});
userSchema.plugin(mongodbErrorHandler)

// before we save the new mentor we want to make sure other mentors with a similar name don't already exist. If they do, we will give them a unique name
userSchema.pre("save", async function (next) {
    if (!this.isModified("lastName")) {
        return next(); //skip this pre-save step
    }
    this.slug = slug(this.lastName)

    // find if other mentors exist that already have the same slug and add a "-#" to the end in order to make it unique
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i")
    const usersWithSlug = await this.constructor.find({
        slug: slugRegEx
    })
    if (usersWithSlug.length) {
        this.slug = `${this.slug}-${usersWithSlug.length + 1}`;
    }

    next();
})

module.exports = new mongoose.model("User", userSchema);