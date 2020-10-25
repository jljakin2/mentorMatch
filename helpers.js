/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require("fs");

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require("moment");

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Mentor Match`;

exports.menu = [{
    slug: "/requests",
    title: "Requests",
  },
  {
    slug: "/top",
    title: "Top Matches",
  },
  {
    slug: "/search",
    title: "Search",
  },
  {
    slug: "/helpful-hints",
    title: "Helpful Hints",
  },
];

// FORM CHOICES
exports.locations = [
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
  "Cartersville, GA",
  "Charleston, SC",
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
  "Other",
];

exports.countries = ["USA", "Canada"];

exports.divisions = [
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
  "Other",
];

exports.departments = [
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
  "Other",
];

exports.jobLevels = [
  "SL5 - Exec. Vice-President / President",
  "SL4 - Sr. Vice-President",
  "SL3 - Vice-President",
  "SL2 - Director",
  "SL1 - Manager",
  "E4 - Sr. Level Associate",
  "E2 - E3 Associate",
  "N2 - N4 Associate",
];

exports.years = [
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10-15 years",
  "15-20 years",
  "20-25 years",
  "25+ years",
];

exports.areas = [
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
  "Work/Life Balance",
];

exports.languages = [
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
  "Vietnamese",
];

exports.educationLevels = [
  "High School",
  "Associates Degree",
  "BA/BS",
  "MS/MBA",
  "PHD",
  "JD",
  "Other",
];