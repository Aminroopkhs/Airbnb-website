const express= require("express");
const router= express.Router({mergeParams:true});
const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const wrapAsync= require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController= require('../controller/review.js');
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
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.writeReview))


// deleting a review from the review collection as well as listing review array
router.delete("/:review_id",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;