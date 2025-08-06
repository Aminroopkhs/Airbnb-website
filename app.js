const express= require('express');
const app=express();
let port=8080;
const session= require("express-session");
const flash= require("connect-flash");
const path= require("path");
// const Listing= require("./models/listing.js");
// const Review= require("./models/review.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapasync.js");
// const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}= require("./schema.js");

// passport
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");
// router
const listingRoute= require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");
// ejs 
app.engine('ejs',ejsMate);
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));

// mongodb
const mongoose= require('mongoose');
main().then(()=>{
    console.log("DB connected successfully");
}) .catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// session options
const sessionOptions={
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000* 60 * 60 * 24 * 3,
        maxAge: 1000* 60 * 60 * 24 * 3,
        httpOnly: true
    }
};
app.use((session(sessionOptions)));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// get request
app.get('/',(req,res)=>{
    res.send("HI i am the home page / page");
})
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    // console.log(res.locals.success);
    next();
})
 
// app.get("/demouser",async(req,res)=>{
//     let fakeuser= new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeruser= await User.register(fakeuser,"helloworld");
//     res.send(registeruser);
//     // console.log(registeruser)
// });

// listening to the port
app.listen(port,()=>{
    console.log("the server is connected to ",port)
})

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);
// // error for any other route except the defined ones
// app.all("*",(req,res,next)=>{
//     next(new ExpressError (404, "Page not found!"));
// })

//custom express error
app.use((err,req,res,next)=>{
    let {status=500, message="Something Went Wrong!"}= err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err})
})

