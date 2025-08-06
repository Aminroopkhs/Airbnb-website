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