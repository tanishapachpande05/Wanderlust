const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{         // new route placed before show route to avoid confusion between id and new. because if show route will be at top then the new will be considered as an id.
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        }
    }).populate("owner");
    if(!listing){
        req.flash("error", "Requested listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

// module.exports.createListing = async (req,res, next)=>{
//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;

//     newListing.image={url, filename};
//     await newListing.save();
//     req.flash("success", "New Listing added!");
//     res.redirect("/listings");

//     // let {title, description, image, price, location, country} = req.body;
//     // let listing = req.body.listing;
//     // console.log(listing);
// };

module.exports.createListing = async (req, res, next) => {
    try {
        const { path: url, filename } = req.file;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "New Listing added!");
        res.redirect("/listings");
    } catch (err) {
        // Multer errors usually come here if file is invalid or size is too big
        req.flash("error", "Failed to create listing. " + err.message);
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){                    // If the listing we are try to edit does not exist.
        req.flash("error", "Requested listing does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_300,w_250");  // to reduce pixels because there is no need of rendering high quality images
    
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req,res,next)=>{
    let {id}=req.params;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});  // ... means destruct. To break into individual parts

    if(typeof req.file != "undefined"){   // if file or img exist then this loop will run
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);           // show route
};

module.exports.destroyListing = async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};