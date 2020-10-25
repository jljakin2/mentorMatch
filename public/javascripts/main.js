const axios = require("axios");

console.log("it worked");
function ajaxRequest(e) {
    e.preventDefault();

    axios
        .post(this.action)
        .then((req, res) => {
            console.log("Request successful!");
            const isRequested = this.request.setAttribute("disabled", true);
            $(".request-button").innerText = "Requested"
            // req.flash("success", "Request was successful!")
        })
        .catch(console.error)
}

const requestForms = document.querySelectorAll("form.request")
console.log(requestForms);




// // ======= REQUEST/ACCEPT/DECLINE TOASTS =======
// // Toast for when user requests a mentor
// document.querySelectorAll(".request-toast").forEach((item) => {
//     item.addEventListener("click", (event) => {
//         toastr.success("Request has been sent");
//         console.log("requested");
//         setTimeout(() => {
//             item.disabled = true;
//         }, 10);
//     });
// });

// // // Toast for when a mentor accepts request from mentee
// document.querySelectorAll(".accept-toast").forEach((item) => {
//     item.addEventListener("click", (event) => {
//         toastr.success("Request has been accepted");
//         console.log("accepted");
//         setTimeout(() => {
//             item.disabled = true;
//         }, 10);
//     });
// });

// // // Toast for when a mentor declines request from mentee
// document.querySelectorAll(".decline-toast").forEach((item) => {
//     item.addEventListener("click", (event) => {
//         toastr.warning("Request has been declined");
//         console.log("success");
//         setTimeout(() => {
//             item.disabled = true;
//         }, 10);
//     });
// });