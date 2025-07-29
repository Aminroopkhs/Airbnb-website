const express= require('express');
const app=express();
let port=8080;
const path= require("path");
// const Listing= require("./models/listing.js");
// const Review= require("./models/review.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapasync.js");
// const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}= require("./schema.js");

// router
const listingRoute= require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");

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

// get request 
app.get('/',(req,res)=>{
    res.send("HI i am the home page / page");
})
// listening to the port
app.listen(port,()=>{
    console.log("the server is connected to ",port)
})

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);

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

