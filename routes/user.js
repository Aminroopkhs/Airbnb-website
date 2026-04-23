const express= require("express");
const router= express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport=require("passport");
const {saveredirectUrl}= require("../middleware.js");
const userController= require("../controller/user.js");
router.get("/login",userController.loginRender)
router.post("/login",saveredirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
    userController.logIn)
router.get("/signup",userController.signupRender);
router.post("/signup",wrapAsync(userController.signUp));
router.get("/logout",userController.logOut);
module.exports= router;