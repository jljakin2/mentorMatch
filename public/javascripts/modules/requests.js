
// // ======= REQUEST/ACCEPT/DECLINE TOASTS =======
// // Toast for when user requests a mentor
// // document.querySelectorAll(".request-toast").forEach((item) => {
// //     item.addEventListener("click", (event) => {
// //         toastr.success("Request has been sent");
// //         setTimeout(() => {
// //             item.disabled = true;
// //         }, 10);
// //     });
// // });

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









// const axios = require("axios");

// console.log("newest build");

// function ajaxRequest(e) {
//     e.preventDefault();
//     // console.log(this.request);
//     axios
//         .post(this.action)
//         .then(res => {
//             this.request.setAttribute("disabled", true);
//             this.request.innerText = "Requested"
//             // req.flash("success", "Request was successful!")
//             console.log("Request successful!");
//         })
//         .catch(err => console.error(err))
// }



// const requestForms = document.querySelectorAll(".request")
// requestForms.forEach(form => {
//     // console.log("eventlistener is working");
//     form.addEventListener("submit", ajaxRequest);
// })