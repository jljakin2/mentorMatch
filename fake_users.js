const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const faker = require('faker');
const fs = require('fs')

const app = express();

app.use(
    session({
        secret: "we are bosch so let's be one.",
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
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
    }]
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Request db schema set up and initiation
const requestsSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Number,
        enums: [
            0, //'rejected',
            1, //'pending',
            2, //'match',
        ],
        default: 1
    }
}, {
    timestamps: true
})

const Request = new mongoose.model('Request', requestsSchema)

// Bosch specific options that can't be used in faker.js
const classificationOptions = ["mentee", "mentor"]

const locationOptions = [
    "Albion, IN",
    "Allen Park, MI",
    "Allendale, NJ",
    "Anderson, SC",
    "Ann Arbor, MI",
    "Atlanta, GA",
    "Bethlehem, PA",
    "Broadview, IL",
    "Brook Park, OH",
    "Buchanan, MI",
    "Burnsville, MN",
    "Canton, MI",
    "Charleston, SC",
    "Cartersville, GA",
    "Charlotte, NC",
    "Chicago, IL",
    "Columbus, OH",
    "El Paso, TX",
    "Exton, PA",
    "Fairport, NY",
    "Farmington Hills, MI",
    "Florence, KY",
    "Fort Lauderdale, FL",
    "Fountain Inn, SC",
    "Fountain Valley, CA",
    "Greer, SC",
    "High Point, NC",
    "Hoffman Estates, IL",
    "Houston, TX",
    "Kalamazoo, MI",
    "Kentwood, MI",
    "Lake Zurich, IL",
    "Lancaster, PA",
    "Laredo, TX",
    "Lexington, KY",
    "Lincoln, NE",
    "Lincolnton, NC",
    "Livonia, MI",
    "Londonberry, NH",
    "Minneapolis, MN",
    "Mississauga, ON",
    "Morrilton, AR",
    "Mount Prospect, IL",
    "New Carlisle, IN",
    "New Richmond, WI",
    "Ontario, CA",
    "Owatonna, MN",
    "Palo Alto, CA",
    "Phoenix, AZ",
    "Pittsburg, PA",
    "Plymouth, MI",
    "Racine, WI",
    "Raleigh, NC",
    "Rochester, MI",
    "Santa Barbara, CA",
    "Shell Lake, WI",
    "St. Joseph, MI",
    "Waltham, MA",
    "Warren, MI",
    "Welland, ON",
    "West Memphis, AR",
    "Wooster, OH",
    "Other"
]
const countryOptions = ["USA", "Canada"]

const divisionOptions = [
    "Corporate Information Systems & Services (CI)",
    "Akustica (AKUS)",
    "Automotive Aftermarket (AA)",
    "Automotive Electronics (AE)",
    "Automotive Steering (AS)",
    "Bosch Battery Systems (BBSN)",
    "Bosch Engineering Group (BEG)",
    "Building Technology (BT)",
    "Car Multimedia (CM)",
    "Chassis Controls (CC)",
    "Corporate (C)",
    "Corporate Research (CR)",
    "Drive & Control Technology (DC)",
    "Electrical Drives (ED)",
    "ETAS",
    "Packaging Technology (PA)",
    "Power Tools (PT)",
    "Powertrain Solutions (PS)",
    "Robert Bosch North America (RBNA)",
    "Service Solutions (SO)",
    "Thermo Technology (TT)",
    "Other"
]
const departmentOptions = [
    "Accounting",
    "Audit",
    "Business Development",
    "Business Unit Leader",
    "Communications",
    "Continuous Improvement (CIP)",
    "Engineering",
    "Facilities Management",
    "Finance/Controlling",
    "General Manager",
    "HS&E",
    "Human Resources",
    "Information Systems / Technology",
    "Legal",
    "Logistics / Supply Chain",
    "Manufacturing",
    "Marketing",
    "Project Management",
    "Purchasing",
    "Quality",
    "Quality Management",
    "Regional President",
    "Research and Development",
    "Sales",
    "Tax",
    "Other"
]
const levelOptions = [
    "SL5 - Exec. Vice-President / President",
    "SL4 - Sr. Vice-President",
    "SL3 - Vice-President",
    "SL2 - Director",
    "SL1 - Manager",
    "E4 - Sr. Level Associate",
    "E2 - E3 Associate",
    "N2 - N4 Associate"
]
const yearsWithCompanyOptions = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10-15 years",
    "15-20 years",
    "20-25 years",
    "25+ years"
]
const yearsCurrentPositionOptions = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10-15 years",
    "15-20 years",
    "20-25 years",
    "25+ years"
]
const areasForDevOptions = [
    "Advertising",
    "Assertiveness and Confidence",
    "Budgeting / Cost Control",
    "Change Management",
    "Communication",
    "Compliance",
    "Computer Skills",
    "Continuous Improvement",
    "Counseling / Advice",
    "Cross-Functional Expertise",
    "Cross-selling",
    "Customer Service",
    "Diversity & Inclusion",
    "Employee Relations",
    "Giving and Receiving Feedback",
    "Innovation",
    "Interviewing / Hiring",
    "Investigations",
    "Leading Self and Others",
    "Learning from Mistakes",
    "Listening",
    "Management",
    "Marketing",
    "Motivation",
    "Navigating Organizational Politics",
    "Negotiation",
    "Networking",
    "Organizational Culture",
    "People Development",
    "Performance Management",
    "Persuasion",
    "Problem-solving",
    "Project Management",
    "Relationship Building",
    "Resolving Conflict",
    "Safety",
    "Sales",
    "Security",
    "Servant Leadership",
    "Strategic Planning",
    "Team Building",
    "Time Management",
    "Training",
    "Transformational Leadership",
    "Work/Life Balance"
]
const areasOfExpOptions = [
    "Advertising",
    "Assertiveness and Confidence",
    "Budgeting / Cost Control",
    "Change Management",
    "Communication",
    "Compliance",
    "Computer Skills",
    "Continuous Improvement",
    "Counseling / Advice",
    "Cross-Functional Expertise",
    "Cross-selling",
    "Customer Service",
    "Diversity & Inclusion",
    "Employee Relations",
    "Giving and Receiving Feedback",
    "Innovation",
    "Interviewing / Hiring",
    "Investigations",
    "Leading Self and Others",
    "Learning from Mistakes",
    "Listening",
    "Management",
    "Marketing",
    "Motivation",
    "Navigating Organizational Politics",
    "Negotiation",
    "Networking",
    "Organizational Culture",
    "People Development",
    "Performance Management",
    "Persuasion",
    "Problem-solving",
    "Project Management",
    "Relationship Building",
    "Resolving Conflict",
    "Safety",
    "Sales",
    "Security",
    "Servant Leadership",
    "Strategic Planning",
    "Team Building",
    "Time Management",
    "Training",
    "Transformational Leadership",
    "Work/Life Balance"
]
const languagesOptions = [
    "American Sign Language (ASL)",
    "Chinese (Mandarin)",
    "Dutch",
    "English",
    "Filipino",
    "Flemish",
    "French",
    "German",
    "Hawaiian",
    "Italian",
    "Japanese",
    "Korean",
    "Polish",
    "Portuguese",
    "Russian",
    "Spanish",
    "Vietnamese"
]
const educationOptions = [
    "High School",
    "Associates Degree",
    "BA/BS",
    "MS/MBA",
    "PHD",
    "JD",
    "Other"
]
const linkedIn = "https://www.linkedin.com/in/jeff-jakinovich-b6b14943/"
const terms = "yes";


for (let id = 1; id <= 100; id++) {

    let classification = classificationOptions[Math.floor(Math.random() * classificationOptions.length)];
    let password = faker.internet.password();
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let username = faker.internet.email();
    let phone = faker.phone.phoneNumberFormat();
    let location = locationOptions[Math.floor(Math.random() * locationOptions.length)];
    let country = countryOptions[Math.floor(Math.random() * countryOptions.length)];
    let division = divisionOptions[Math.floor(Math.random() * divisionOptions.length)];
    let department = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
    let level = levelOptions[Math.floor(Math.random() * levelOptions.length)];
    let yearsWithCompany = yearsWithCompanyOptions[Math.floor(Math.random() * yearsWithCompanyOptions.length)];
    let yearsCurrentPosition = yearsCurrentPositionOptions[Math.floor(Math.random() * yearsCurrentPositionOptions.length)];
    let areasForDev = function () {
        const finalDevs = [];

        for (let i = 0; i < 10; i++) {
            finalDevs.push(areasForDevOptions[Math.floor(Math.random() * areasForDevOptions.length)])
        }

        return finalDevs;
    };
    let areasOfExp = function () {
        const finalExps = [];

        for (let i = 0; i < 10; i++) {
            finalExps.push(areasOfExpOptions[Math.floor(Math.random() * areasOfExpOptions.length)])
        }

        return finalExps;
    };
    let languages = function () {
        const finalLanguages = [];

        for (let i = 0; i < 2; i++) {
            finalLanguages.push(languagesOptions[Math.floor(Math.random() * languagesOptions.length)])
        }

        return finalLanguages;
    };
    let education = educationOptions[Math.floor(Math.random() * educationOptions.length)];
    let certifications = faker.lorem.text();
    let communityService = faker.lorem.text();
    let whyJoin = faker.lorem.paragraph();
    let communicationMethod = faker.lorem.sentence();
    let goals = faker.lorem.paragraph();


    User.register({
            classification: classification,
            firstName: firstName,
            lastName: lastName,
            password: password,
            username: username,
            phone: phone,
            location: location,
            country: country,
            division: division,
            department: department,
            level: level,
            yearsWithCompany: yearsWithCompany,
            yearsCurrentPosition: yearsCurrentPosition,
            areasForDev: areasForDev(),
            areasOfExp: areasOfExp(),
            languages: languages(),
            education: education,
            certifications: certifications,
            communityService: communityService,
            linkedin: linkedIn,
            whyJoin: whyJoin,
            mentorshipProcess: communicationMethod,
            goals: goals,
            terms: terms,
        },
        password)
}