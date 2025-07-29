const express= require('express');
const router= express.Router();

router.get("/",(req,res)=>{
    res.send("posts index route");
})
router.get("/:id",(req,res)=>{
    res.send("posts get route");
})
router.post("/",(req,res)=>{
    res.send("post the post route");
})
router.delete("/:id",(req,res)=>{
    res.send("posts delete");
})
module.exports=router;