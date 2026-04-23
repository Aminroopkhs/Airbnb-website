const express= require("express");
const router= express.Router();
const Listing= require("../models/listing.js");
const wrapAsync= require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const {isLoggedIn,isOwner}= require("../middleware.js");
const listingcontroller= require("../controller/listing.js")
// const {isOwner}=require("")
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

router
    .route("/")
    // lists all the villas and other things on the page
    // index route
    .get(wrapAsync(listingcontroller.index))
    //  create route
    .post(isLoggedIn,validateListing, wrapAsync(listingcontroller.newlisting));

// new route--> get request /listings/new --> returns a form to create new listing 
// create route---> post request /listings/new or /listings---> saves the newly added listing to the databse
router.get("/new",isLoggedIn,listingcontroller.newroute);

router
    .route("/:id")
    // show route when clicked it specifically shows a particular villa (read operation)
    .get(wrapAsync(listingcontroller.specificvilla))
    // update route!!!
    .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingcontroller.updateroute))
    // delete request /listings/:id
    .delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteroute));

// edit and update route
// get request /listings/:id/edit --> edit form rendering --> submit
//put request /listings/:id
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.editroute));

module.exports=router;