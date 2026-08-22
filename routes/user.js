const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
//sign up

router
  .route("/signup")
  .get(userController.renderSignUp)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLogIn)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.logIn,
  );

//log out
router.get("/logout", userController.logOut);

module.exports = router;
