module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be loggedIn to create Listing")
        return res.redirect("/login")
    }
    next();
    }