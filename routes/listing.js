const express= require("express");
const router= express.Router();
const Listing= require("../models/listing.js");
const wrapAsync= require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const {isLoggedIn}= require("../middleware.js");
// converting validation (JOI) into a middlware
const validateListing= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if (error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

// lists all the villas and other things on the page
// index route
router.get("/",wrapAsync(async(req,res)=>{
    const all_listings= await Listing.find({});
        res.render("./listings/index.ejs",{all_listings});
    }))
// new route--> get request /listings/new --> returns a form to create new listing 
// create route---> post request /listings/new or /listings---> saves the newly added listing to the databse
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user)
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be loggedIn to create Listing")
    //     return res.redirect("/login")
    // } written in the middleware.js file

    res.render("./listings/new.ejs")
})

// show route when clicked it specifically shows a particular villa (read operation)
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findById(id).populate("reviews");
    // console.log(listing)
    if (!listing){
        req.flash("error","Listing Does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}))

//  create route
router.post("/",isLoggedIn,validateListing, wrapAsync(async(req,res,next)=>{
    // let {title,description,image,price,country,location}= req.body; one of the ways to print
    // let listing= req.body.listing;
    // let result= listingSchema.validate(req.body);
    // if (result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const new_listing= new Listing(req.body.listing);
        // checking only the entire listing and not the individual fields.
        // if (!req.body.listing){
        //     throw new ExpressError(400,"Send Valid data for listing");
        // }
    await new_listing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
}))

// edit and update route
// get request /listings/:id/edit --> edit form rendering --> submit
//put request /listings/:id
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findById(id);
    if (!listing){
        req.flash("error","Listing Does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}))

// update route!!!
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    // if (!req.bosy.listing){
    //         throw new ExpressError(400,"Send Valid data for listing");
    //     };
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    res.redirect("/listings");
}))

// delete request /listings/:id
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    id=id.replace(":","");
    console.log(id)
    const listing= await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}))

module.exports=router;