const express = require("express");
const userController = require("../controllers/userController");
const requestsController = require("../controllers/requestsController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const router = express.Router();
const { catchErrors } = require("../handlers/errorHandlers");

// === AUTH ===
router
  .route("/")
  // gets route for home page which is where user can either register or login
  .get(userController.homePage);

router
  .route("/login")
  // gets the login page for the user to login
  .get(authController.loginForm)
  // logs user in
  .post(authController.login);

router
  .route("/logout")
  //logs user out
  .get(authController.logout);

router
  .route("/login/forgot")
  .get(authController.forgotForm)
  .post(catchErrors(authController.forgot));

// === USER ===
router
  .route("/register")
  // gets the registration form for the user to fill out
  .get(userController.registerForm)
  // once user submits registration form we will validate and cleanse the responses, register them in our database, and finally log them in
  .post(
    userController.upload,
    catchErrors(userController.resize),
    userController.yesToTerms,
    userController.atLeastSL1,
    userController.validateRegister,
    catchErrors(userController.register),
    authController.login
  );

router
  .route("/welcome")
  // gets the welcome page which is the first page the user will see after logging in
  .get(authController.isLoggedIn, userController.welcome);

router
  .route("/account/:slug")
  // gets the account page for the user to review their account info
  .get(
    authController.isLoggedIn,
    catchErrors(userController.whichCountry),
    catchErrors(userController.getAccount)
  );

router
  .route("/account/:slug/edit")
  // takes user to the edit account page
  .get(authController.isLoggedIn, userController.editAccount)
  // allow user to update their account
  .post(
    userController.upload,
    catchErrors(userController.resize),
    catchErrors(userController.updateAccount)
  );

router
  .route("/account/reset/:token")
  .get(catchErrors(authController.reset))
  .post(authController.confirmedPasswords, catchErrors(authController.update));

router
  .route("/search")
  // gets the search page so the user can search for other users based on basic and advanced criteria
  .get(authController.isLoggedIn, userController.searchForm)
  .post(catchErrors(userController.searchResults));

// router
//     .route("/search/:query")
//     .get(userController.getSearchResults)
//     // gets the results from the user's search query and displays them
//     .post(catchErrors(userController.searchResults));

// === REQUESTS ===
router
  .route("/requests")
  // gets requests page for user to manage requests
  .get(
    authController.isLoggedIn,
    catchErrors(requestsController.manageRequests)
  );

router
  .route("/request/:userId")
  .post(catchErrors(requestsController.addRequest));

router
  .route("/accept/:userId")
  .post(
    catchErrors(requestsController.isAcceptedAlready),
    catchErrors(requestsController.acceptRequest)
  );

router
  .route("/decline/:userId")
  .post(catchErrors(requestsController.declineRequest));

router.route("/top-matches").get(catchErrors(userController.findTopMatches));

router.route("/resources").get(userController.getResources);

// === ADMIN ===
router.route("/admin").get(adminController.isAdmin, adminController.adminNav);

router
  .route("/admin/participants")
  .get(adminController.isAdmin, catchErrors(adminController.participants));

router
  .route("/admin/remove-admin/:id")
  .post(catchErrors(adminController.removeAdmin));

router.route("/admin/add/:id").post(catchErrors(adminController.addAdmin));

router
  .route("/admin/remove-user/:id")
  .post(catchErrors(adminController.removeUser));

router
  .route("/admin/current-connections")
  .get(
    adminController.isAdmin,
    catchErrors(adminController.currentConnections)
  );

router
  .route("/admin/current-connections/delete/:menteeid/:mentorid")
  .post(adminController.isAdmin, catchErrors(adminController.deleteConnection));

router
  .route("/admin/current-connections/delete-all")
  .post(adminController.isAdmin, catchErrors(adminController.deleteAll));

router
  .route("/admin/add-manual-connection")
  .get(adminController.isAdmin, adminController.addManualConnection);

router
  .route("/admin/add-manual-connection/add")
  .post(adminController.isAdmin, catchErrors(adminController.manuallyAdd));

router
  .route("/admin/gap-analysis")
  .get(adminController.isAdmin, adminController.gapAnalysis);

// exports all of these routes so we can use them on the app.js file
module.exports = router;
