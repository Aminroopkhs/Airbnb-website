const express= require('express');
const app=express();
const users=require("./routes/user.js");
const posts= require("./routes/post.js");
const session=require("express-session");
const flash= require("connect-flash");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
const sessionOptions= {secret: "mysupersecretstring",
                resave:false, 
                saveUninitialized:true}
// parsing the cookie
// const cookieParser=require("cookie-parser");
// app.use(cookieParser("secretcode"));
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent just now~~")
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// app.get("/greet",(req,res)=>{
//     let {Name="anonymous"} =req.cookies;
//     res.send(`Hi, ${Name}`);
// })
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("MadeIn","India");
//     res.send("sent you a cookie");
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("Hi i am root");
// });
// app.use("/users",users);
// app.use("/posts",posts)

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}= req.query;
    req.session.name=name;
    if (name==="anonymous"){
         req.flash("error","user not registered successfully");
    } else{
    req.flash("success","user registered successfully");}
    // console.log(req.session.name)
    // res.send(`Hello ${req.session.name}`);
    // res.render("page.ejs",{name})
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    // res.send("hello");
    // res.send(`Hello ${req.session.name}`);
    // console.log(req.flash("success"))
    // res.locals.success= req.flash("success");
    // res.locals.error= req.flash("error");
    res.render("page.ejs",{name: req.session.name});
})
// app.get("/reqcount",(req,res)=>{
//     if (req.session.count){
//         req.session.count++;
//     } else{
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })


// app.get("/test",(req,res)=>{
//     res.send("Test Successful!");
// })

app.listen(3000,()=>{
    console.log("server's listening to port 3000")
});