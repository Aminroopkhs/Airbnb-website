const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const Review=require("./review.js");
const listingSchema= new Schema({
    title: {type: String, required:true},
    description: String,
    image:{ filename: String,
    url: {type: String, default:"https://unsplash.com/photos/tree-branches-reach-towards-a-clear-blue-sky-oajlEpl_m_w",
        set: (v)=> v=== "" ? "https://unsplash.com/photos/tree-branches-reach-towards-a-clear-blue-sky-oajlEpl_m_w" : v,
    }},
    price:Number,
    location:String,
    country:String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
}]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in : listing.reviews}})
    }
})
const Listing= mongoose.model('Listing', listingSchema);

module.exports= Listing;