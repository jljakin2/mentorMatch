const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify= require("es6-promisify");
const mail = require("../handlers/mail");

// grabs login page so user can login
exports.loginForm = (req, res) => {
    res.render("login", {
        title: "Login"
    });
};

exports.forgotForm = (req, res) => {
    res.render("forgot", {title: "Forgot Password"})
}

// logs user in using passport's local strategy
exports.login = passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Failed login!",
    successRedirect: "/welcome",
    successFlash: "You are now logged in!",
});

// logs the user out
exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "You are now logged out! 👋");
    res.redirect("/login");
};

// checks to see if the user is logged in
exports.isLoggedIn = (req, res, next) => {
    // first check if the user is authenticated
    if (req.isAuthenticated()) {
        return next(); // carry on! They are logged in
    }
    req.flash("error", "Oops you must be logged in to do that!");
    res.redirect("/login");
}

// ===== FORGOT PASSWORD PROCESS =====
exports.forgot = async (req, res) => {
    // see if user with designated email exists
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        req.flash("error", "No account with that email exists.")
        return res.redirect('/login')
    }

    // set reset tokens and expiry on the user's account
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // send user an email with the token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

    // TEST the resetURL in development mode to make sure it works. NEVER KEEP THIS LINE OF CODE FOR PRODUCTION!!!
    // req.flash("success", `You have been emailed a password reset link. ${resetURL}`);

    await mail.send({
        user,
        subject: "Password Reset",
        resetURL,
        filename: "password-reset"
    })

    req.flash("success", "You have been emailed a password reset link.");

    // redirect the user to the login page
    res.redirect("/login");
}

exports.reset = async (req, res) => {
    // look for user based on the token they provide
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    })
    // if a user isn't found, send error and redirect to login page
    if (!user) {
        req.flash("error", "Password reset is invalid or has expired.");
        return res.redirect("/login");
    }

    // if the user does exist, show the reset password form
    res.render("reset", {
        title: "Reset your password"
    })
}

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body["confirm-password"]) {
        return next() // keep going!
    }
    req.flash("error", "Passwords do not match!")
    res.render("back")
};

exports.update = async (req, res) => {
    // look for user based on the token they provide
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    })

    // if a user isn't found, send error and redirect to login page
    if (!user) {
        req.flash("error", "Password reset is invalid or has expired.");
        return res.redirect("/login");
    }

    const setPassword = promisify(user.setPassword, user); // need promisify library to return a promise, otherwise, callbacks are needed
    await setPassword(req.body.password); // handles hashing and salting automatically

    user.resetPasswordToken = undefined; // you can remove a field from mongodb by making the value "undefined"
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save(); // need to save user in order to actually change the token fields

    // finally login user
    await req.login(updatedUser)
    req.flash("success", "👍 Nice! Your password has been reset. You are now logged in.");
    res.redirect("/welcome");
};