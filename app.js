const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

// app.use((req, res, next) => {
//     console.log("REQ PATH:", req.path);
//     console.log("REQ BODY:", req.body);
//     next();
// });

app.get("/", (req,res)=>{
    res.send("This is Home page");
})

// app.get("/listings", (req, res) => {
//     res.send("Listings Page");
// });

// Index Route
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}))

// New Route
app.get("/listings/new", (req,res)=>{         // new route placed before show route to avoid confusion between id and new. because if show route will be at top then the new will be considered as an id.
    res.render("listings/new.ejs");
})

// Show Route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))

// Create Route
app.post("/listings", wrapAsync(async (req,res, next)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
        const newListing = new Listing(req.body.listing);   // here listing is an object containing title, description, price, and all.
        await newListing.save();
        res.redirect("/listings")
        })
    // let {title, description, image, price, location, country} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
);

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))



// Update Route
app.put("/listings/:id", wrapAsync(async (req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});     // ... means destruct. To break into individual parts
    res.redirect(`/listings/${id}`);           // show route
}))

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

// //Update Route
// app.put("/listings/:id", wrapAsync(async (req, res, next) => {
//     const { id } = req.params;
//     if (!id) throw new ExpressError(400, "Missing listing ID");
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));


// // Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
//     const { id } = req.params;
//     if (!id) throw new ExpressError(400, "Missing listing ID");
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));



// app.all("*", (req, res, next)=>{
//     next(new ExpressError(404, "Page Not Found!"));
// })

app.use((err,req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"}=err;
    res.status(statusCode).send(message);
})

// app.use((err, req, res, next)=>{
//     res.send("Something went wrong!");
// })


// app.get("/testListing", async (req,res)=>{
//     let sampleListing=new Listing({
//         title: "My Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "katra, jammu",
//         country : "india"
//     });

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("successful");
// })

app.listen(8080, ()=>{
    console.log("server is listening at port 8080");
})