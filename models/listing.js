const mongoose = require("mongoose"); 
const Review = require("./review.js");
const { type } = require("os");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
    type : String,
    required : true,
    } ,
    description: String,
    image:{
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        // enum: ["trending","rooms","city","mountain","castle","pool","camp","farm","arctic"],
    },
});

const Listing = mongoose.model("Listing",listingSchema);

//findByIdAndDelete method triggers this middleware when listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})

module.exports = Listing;