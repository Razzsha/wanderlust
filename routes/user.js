const express = require("express");
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware');

const userController = require("../controllers/users");

// SIGNUP ROUTES: render form & handle submission
router
    .route('/signup')
    .get(userController.renderSignupForm)   // Show signup form
    .post(wrapAsync(userController.signup)); // Process signup form submission

// LOGIN ROUTES: render form & handle login
router
    .route('/login')
    .get(userController.renderLoginForm) // Show login form
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        userController.login // Process login form
    );

// LogOut Route
router.get('/logout', userController.logout);

module.exports = router;
