document.addEventListener("keyup", function () {
    const password1 = document.querySelector("#password");
    const password2 = document.querySelector("#confirm-password");

    if (password2.value.length > 0) {
        document.querySelector(".doNotMatch").classList.remove("hide");
        if (password2.value === password1.value) {
            document.querySelector(".doNotMatch").classList.add("hide");
            document.querySelector(".match").classList.remove("hide");
        } else if (password2.value !== password1.value) {
            document.querySelector(".doNotMatch").classList.remove("hide");
            document.querySelector(".match").classList.add("hide");
        }
    }
});