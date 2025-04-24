const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const listingSchema= new Schema({     //creating schema
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,        // DEFAULT is when image does not exist       // SET is when image url is empty
        default: "http://www.photo-paysage.com/albums/userpics/10001/Cascade_-15.JPG",
        set: (v) => v===""?"http://www.photo-paysage.com/albums/userpics/10001/Cascade_-15.JPG":v               // ternary operator used
    },
    price:{
        type: Number,
    },
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);      // model created
module.exports = Listing;