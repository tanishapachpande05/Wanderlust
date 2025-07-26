// module.exports.isLoggedIn = (req, res, next)=>{
//     if(!req.isAuthenticated()){
//         req.flash("error", "You must be logged in to add new Listing!");
//         return req.redirect("/login");
//     }
//     next();
// }

let Listing = require("./models/listing");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to add new Listing!");
        return res.redirect("/login");  // Use res.redirect and return to stop further execution
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// module.exports.isOwner = async (req,res,next)=>{
//     let {id}=req.params;
//     let listing = await Listing.findById(id);

//     if(!listing.owner._id.equals(res.locals.currUser._id)){
//         req.flash("error", "You are not the owner of this listing");
//         return res.redirect(`/listings/${id}`);
//     }

//     next();
// }

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// module.exports.validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// };

module.exports.validateListing = (req, res, next) => {
    try {
        const { error } = listingSchema.validate(req.body);
        if (error) {
            const errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }
        next();
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("back");
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// module.exports.isReviewAuthor = async (req,res,next)=>{
//     let {id, reviewId}=req.params;              //because the route consist of review id, not owner id
//     let review = await Review.findById(id);

//     if(!review.owner._id.equals(res.locals.currUser._id)){
//         req.flash("error", "You are not the author of this review");
//         return res.redirect(`/listings/${id}`);     // redirect to show route
//     }

//     next();
// }

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};