const express= require('express');
const app=express();
const users=require("./routes/user.js");
const posts= require("./routes/post.js");
// parsing the cookie
const cookieParser=require("cookie-parser");
app.use(cookieParser("secretcode"));
app.get("/getsignedcookie",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie sent just now~~")
})
app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
})
app.get("/greet",(req,res)=>{
    let {Name="anonymous"} =req.cookies;
    res.send(`Hi, ${Name}`);
})
app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.cookie("MadeIn","India");
    res.send("sent you a cookie");
})
app.get("/",(req,res)=>{
    console.dir(req.cookies)
    res.send("Hi i am root");
});
app.use("/users",users);
app.use("/posts",posts)
app.listen(3000,()=>{
    console.log("server's listening to port 3000")
});