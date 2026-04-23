const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
module.exports.writeReview= async(req,res)=>{
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
};

module.exports.deleteReview= async(req,res)=>{
    let {id,review_id}=req.params;
    console.log(id);
    console.log(review_id);
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};