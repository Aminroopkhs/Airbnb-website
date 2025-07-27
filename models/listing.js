const mongoose= require('mongoose');
const Schema= mongoose.Schema;

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
const Listing= mongoose.model('Listing', listingSchema);

module.exports= Listing;