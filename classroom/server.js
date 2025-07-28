const express= require('express');
const app=express();





app.get("/",(req,res)=>{
    res.send("Hi i am root");
});

app.listen(3000,()=>{
    console.log("server's listening to port 3000")
});