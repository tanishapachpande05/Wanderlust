if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
};

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("./schema.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // Suppose for 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

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
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async(req, res)=>{
    let fakeUser = new User({
        email: "abc@getMaxListeners.com",
        username: "abc"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");

    res.send(registeredUser);
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



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


app.all(/.*/, (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})

// app.use("*", (req, res, next)=>{
//     next(new ExpressError(404, "Page Not Found!"));
// })

app.use((err,req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"}=err;
    // res.status(statusCode).send(message);       //this ExpressError will display error message on screen/page
    res.status(statusCode).render("error.ejs", {message});
})

// app.use((err, req, res, next) => {
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