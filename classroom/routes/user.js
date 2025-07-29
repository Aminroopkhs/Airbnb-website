const express= require('express');
// router object!
const router= express.Router();


router.get("/",(req,res)=>{
    res.send("users");
})
router.get("/:id",(req,res)=>{
    res.send("users get route");
})
router.post("/",(req,res)=>{
    res.send("users post");
})
router.delete("/:id",(req,res)=>{
    res.send("users delete");
});

module.exports=router;