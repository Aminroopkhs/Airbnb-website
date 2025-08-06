const express= require("express");
const router= express.Router({mergeParams:true});
const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const wrapAsync= require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
// converting validation (JOI) into a middlware
const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body)
    if (error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next()
    }
}
// post request for reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    id=id.replace(":","")
    console.log(id);
    let listing= await Listing.findById(id);
    let new_review= new Review(req.body.review);
    new_review.author= req.user._id;
    console.log(new_review)
    listing.reviews.push(new_review)
    await new_review.save();
    await listing.save();
    req.flash("success","Thank you for the review!");
    res.redirect(`/listings/${id}`)
}))


// deleting a review from the review collection as well as listing review array
router.delete("/:review_id",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,review_id}=req.params;
    console.log(id);
    console.log(review_id);
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;