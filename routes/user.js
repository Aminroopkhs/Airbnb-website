const express= require("express");
const router= express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport=require("passport");
const {saveredirectUrl}= require("../middleware.js")
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",saveredirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
    async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust you are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
})
router.get("/signup",async(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    // let user= req.body.user;
    // console.log(user);
    // let newUser= new User(req.body.user);
    // await newUser.save().then((req,res)=>{
    //     console.log(res);
    // });
    try{
        let {email,username,password}=req.body;
    // console.log(req.params);
        const newUser= new User({email,username});
        const reg_user=await User.register(newUser,password);
        // console.log(reg_user);
        req.login(reg_user,(err)=>{
            if(err){
            return next(err);
        }
        req.flash("success","You are registered! Enjoy the Website!");
        res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    // let {email,username,password}=req.body;
    // // console.log(req.params);
    // const newUser= new User({email,username});
    // const reg_user=await User.register(newUser,password);
    // console.log(reg_user);
    // req.flash("Success","You are registered! Enjoy the Website!");
    // res.redirect("/listings");

}));
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out now");
        res.redirect("/listings");
    })
})
module.exports= router;