const Listing=require("../models/listing.js")

module.exports.index=async(req,res)=>{
    const all_listings= await Listing.find({});
        res.render("./listings/index.ejs",{all_listings});
    };

module.exports.newroute=(req,res)=>{
    console.log(req.user)
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be loggedIn to create Listing")
    //     return res.redirect("/login")
    // } written in the middleware.js file

    res.render("./listings/new.ejs")
};

module.exports.specificvilla=async (req,res)=>{
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findById(id).populate({path: "reviews", populate:{path:"author"}}).populate("owner");
    // console.log(listing)
    if (!listing){
        req.flash("error","Listing Does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
};

module.exports.newlisting=async(req,res,next)=>{
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
    new_listing.owner= req.user._id;
    await new_listing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
};

module.exports.editroute=async(req,res)=>{
    let {id}= req.params;
    // id= id.replace(":","");
    const listing= await Listing.findById(id);
    if (!listing){
        req.flash("error","Listing Does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
};

module.exports.updateroute=async(req,res)=>{
    // if (!req.bosy.listing){
    //         throw new ExpressError(400,"Send Valid data for listing");
    //     };
    let {id}= req.params;
    // // id= id.replace(":","");
    // let listing= awaitListing.findById(id);
    // if (!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","You have permission to edit");
    //     return res.redirect(`/listings/${id}`)
    // }
    const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    res.redirect("/listings");
};

module.exports.deleteroute=async(req,res)=>{
    let {id}=req.params;
    id=id.replace(":","");
    console.log(id);
    const listing= await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
};