const express= require('express');
const app=express();
let port=8080;
const path= require("path");
const Listing= require("./models/listing.js");
const Review= require("./models/review.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapasync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js");
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

const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body)
    if (error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next()
    }
}
// get request 
app.get('/',(req,res)=>{
    res.send("HI i am the home page / page");
})
// listening to the port
app.listen(port,()=>{
    console.log("the server is connected to ",port)
})

// lists all the villas and other things on the page
// index route
app.get("/listings",wrapAsync(async(req,res)=>{
    const all_listings= await Listing.find({});
        res.render("./listings/index.ejs",{all_listings});
    }))
// new route--> get request /listings/new --> returns a form to create new listing 
// create route---> post request /listings/new or /listings---> saves the newly added listing to the databse
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs")
})
app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
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
    res.redirect("/listings");
}))

// edit and update route
// get request /listings/:id/edit --> edit form rendering --> submit
//put request /listings/:id
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))

app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    // if (!req.bosy.listing){
    //         throw new ExpressError(400,"Send Valid data for listing");
    //     };
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}))

// delete request /listings/:id
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    id=id.replace(":","");
    console.log(id)
    const listing= await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

// post request for reviews
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    id=id.replace(":","")
    console.log(id);
    let listing= await Listing.findById(id);
    let new_review= new Review(req.body.review);
    listing.reviews.push(new_review)
    await new_review.save();
    await listing.save();
    res.redirect(`/listings/${id}`)
}))

// show route when clicked it specifically shows a particular villa (read operation)
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}))

// deleting a review from the review collection as well as listing review array
app.delete("/listings/:id/reviews/:review_id",wrapAsync(async(req,res)=>{
    let {id,review_id}=req.params;
    console.log(id);
    console.log(review_id);
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${id}`);
}));


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

