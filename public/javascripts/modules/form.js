const classification = document.querySelector("#mentorMentee");

classification.addEventListener("input", function () {
    if (this.value === "Mentor") {
        document.querySelector("#mentorQuestion").style.display = "block";
        document.querySelector("#menteeQuestion").style.display = "none";
        document.querySelector("#expAreas").style.display = "block";
        document.querySelector("#devAreas").style.display = "none";
    } else if (this.value === "Mentee") {
        document.querySelector("#mentorQuestion").style.display = "none";
        document.querySelector("#menteeQuestion").style.display = "block";
        document.querySelector("#expAreas").style.display = "none";
        document.querySelector("#devAreas").style.display = "block";
    }
});