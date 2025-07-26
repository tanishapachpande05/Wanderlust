const User=require("../models/user.js");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already exists, please choose another.");
      return res.redirect("/signup");
    }

    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");    // or wherever you want after signup
    });
  } catch (e) {
    next(e);
  }
};

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome to WanderLust ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("error", "You are successfully logged out!");
        res.redirect("/listings");
    })
};