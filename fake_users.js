const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const faker = require('faker');
const fs = require('fs')

// const app = express();

// app.use(
//     session({
//         secret: "we are bosch so let's be one.",
//         resave: false,
//         saveUninitialized: false,
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/mentorMatchDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// mongoose.set("useCreateIndex", true);

// // User database set up
// const userSchema = new mongoose.Schema({
//     classification: String,
//     firstName: String,
//     lastName: String,
//     slug: String,
//     email: String,
//     phone: String,
//     location: String,
//     country: String,
//     division: String,
//     department: String,
//     level: String,
//     yearsWithCompany: String,
//     yearsCurrentPosition: String,
//     areas: Array,
//     languages: Array,
//     education: String,
//     certifications: String,
//     communityService: String,
//     linkedin: String,
//     whyMentor: String,
//     whyMentee: String,
//     mentorshipProcess: String,
//     goals: String,
//     terms: String,
//     profilePicture: String,
// }, {
//     timestamps: true
// });

// userSchema.plugin(passportLocalMongoose);

// const User = new mongoose.model("User", userSchema);

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Request db schema set up and initiation
// const requestsSchema = new mongoose.Schema({
//     requester: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     recipient: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     status: {
//         type: Number,
//         enums: [
//             0, //'rejected',
//             1, //'pending',
//             2, //'match',
//         ],
//         default: 1
//     }
// }, {
//     timestamps: true
// })

// const Request = new mongoose.model('Request', requestsSchema)

const users = [];

// Bosch specific options that can't be used in faker.js
const classificationOptions = ["Mentee", "Mentor"]

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
const areasDevExp = [
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


// change value HERE to adjust how many users are created
for (let id = 1; id <= 50; id++) {

    const user = new Object();

    let classification = classificationOptions[Math.floor(Math.random() * classificationOptions.length)];
    let password = faker.internet.password();
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let slug = lastName.toLowerCase()
    let username = faker.internet.email();
    let phone = faker.phone.phoneNumberFormat();
    let location = locationOptions[Math.floor(Math.random() * locationOptions.length)];
    let country = countryOptions[Math.floor(Math.random() * countryOptions.length)];
    let division = divisionOptions[Math.floor(Math.random() * divisionOptions.length)];
    let department = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
    let level = levelOptions[Math.floor(Math.random() * levelOptions.length)];
    let yearsWithCompany = yearsWithCompanyOptions[Math.floor(Math.random() * yearsWithCompanyOptions.length)];
    let yearsCurrentPosition = yearsCurrentPositionOptions[Math.floor(Math.random() * yearsCurrentPositionOptions.length)];
    let areas = function () {
        const finalAreas = [];

        for (let i = 0; i < 10; i++) {
            finalAreas.push(areasDevExp[Math.floor(Math.random() * areasDevExp.length)])
        }

        return finalAreas;
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
    let whyMentor = faker.lorem.paragraph();
    let whyMentee = faker.lorem.paragraph();
    let communicationMethod = faker.lorem.sentence();
    let goals = faker.lorem.paragraph();
    let profilePicture = faker.image.avatar()



    user.classification = classification,
    user.firstName = firstName,
    user.lastName = lastName,
    user.slug = slug,
    user.password = password,
    user.email = username,
    user.phone = phone,
    user.location = location,
    user.country = country,
    user.division = division,
    user.department = department,
    user.level = level,
    user.yearsWithCompany = yearsWithCompany,
    user.yearsCurrentPosition = yearsCurrentPosition,
    user.areas = areas(),
    user.languages = languages(),
    user.education = education,
    user.certifications = certifications,
    user.communityService = communityService,
    user.linkedin = linkedIn,
    user.whyMentor = whyMentor,
    user.whyMentee = whyMentee,
    user.mentorshipProcess = communicationMethod,
    user.goals = goals,
    user.terms = terms,
    user.profilePicture = profilePicture

    users.push(user)
}

// console.log(users)
const userJSON = JSON.stringify(users)
fs.writeFile("users.json", userJSON, function(err, result) {
    if (err) console.log("uh oh something went wrong", err);
})