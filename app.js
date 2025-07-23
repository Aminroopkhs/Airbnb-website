const express= require('express');
const app=express();
let port=8080;
const path= require("path");
const Listing= require("./models/listing.js");
const methodOverride= require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
// ejs 
app.engine('ejs',ejsMate);
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
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
app.get("/listings",async(req,res)=>{
    const all_listings= await Listing.find({});
        res.render("./listings/index.ejs",{all_listings});
    })
// new route--> get request /listings/new --> returns a form to create new listing 
// create route---> post request /listings/new or /listings---> saves the newly added listing to the databse
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs")
})
app.post("/listings",async(req,res)=>{
    // let {title,description,image,price,country,location}= req.body; one of the ways to print
    // let listing= req.body.listing;
    const new_listing= new Listing(req.body.listing);
    // console.log(listing);
    await new_listing.save();
    res.redirect("/listings");
})

// edit and update route
// get request /listings/:id/edit --> edit form rendering --> submit
//put request /listings/:id
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    id= id.replace(":","");
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

app.put("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    id= id.replace(":","");
    const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
})

// delete request /listings/:id
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    id=id.replace(":","");
    const listing= await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
// show route when clicked it specifically shows a particular villa (read operation)
app.get("/listings/:id",async (req,res)=>{
    let {id}= req.params;
    id= id.replace(":","");
    const listing= await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})



