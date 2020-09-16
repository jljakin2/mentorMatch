// Toast for when user requests a mentor
document.querySelectorAll(".request-toast").forEach((item) => {
  item.addEventListener("click", (event) => {
    toastr.success("Request has been sent");
    console.log("requested");
    setTimeout(() => {
      item.disabled = true;
    }, 10);
  });
});

// Toast for when a mentor accepts request from mentee
document.querySelectorAll(".accept-toast").forEach((item) => {
  item.addEventListener("click", (event) => {
    toastr.success("Request has been accepted");
    console.log("accepted");
    setTimeout(() => {
      item.disabled = true;
    }, 10);
  });
});

// Toast for when a mentor declines request from mentee
document.querySelectorAll(".decline-toast").forEach((item) => {
  item.addEventListener("click", (event) => {
    toastr.warning("Request has been declined");
    console.log("success");
    setTimeout(() => {
      item.disabled = true;
    }, 10);
  });
});
