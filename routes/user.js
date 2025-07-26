const express=require("express");
const router = express.Router({mergeParams: true});
const User= require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);


// router.post("/signup", wrapAsync(async (req, res)=>{
//     try{
//         let {username, email, password}= req.body;
//         let newUser= new User({email, username});
//         let registeredUser= await User.register(newUser, password);
//         console.log(registeredUser);
//         req.flash("success", "Welcome to WanderLust!");
//         res.redirect("/listings");
//     }catch(err){
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }
    
// }));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

router.get("/logout", userController.logout);

module.exports = router;