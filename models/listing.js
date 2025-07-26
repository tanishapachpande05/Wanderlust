const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema= new Schema({     //creating schema
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required: [true, "Description is missing"]
    },
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [           // Reviews added in listing schema
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    } 
});

listingSchema.post("findOneAndDelete", async(listing)=>{      // Whenever the delete button in a show listing will get clicked, this will also run to delete listing's all reviews also.
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);      // model created
module.exports = Listing;