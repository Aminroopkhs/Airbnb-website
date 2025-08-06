const Listing= require("./models/listing.js");
const Review= require("./models/review.js");
module.exports.isLoggedIn= (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl)
    if(!req.isAuthenticated()){
        // infor of the user redirect url
        req.session.redirectUrl= req.originalUrl;
        // console.log(req.session.redirectUrl);
        req.flash("error","you must be loggedIn to create Listing")
        return res.redirect("/login")
    }
    next();
    }
module.exports.saveredirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl
    }
    next();
}
module.exports.isOwner= async (req,res,next)=>{
    let {id}= req.params;
    // console.log(id);
    id=id.replace(":","");
    let listing= await Listing.findById(id);
    if (! listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You have no permission to edit");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewAuthor= async (req,res,next)=>{
    let {review_id,id}= req.params;
    // console.log(id);
    id=id.replace(":","");
    review_id=review_id.replace(":","")
    let listing= await Review.findById(review_id);
    if (! review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}