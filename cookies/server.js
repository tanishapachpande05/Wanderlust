const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
const sessionOptions = {secret : "mysupersecretstring", resave:false, saveUninitialized:true};

app.use(session(sessionOptions));

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");         // no need to explicitly pass these variables in res.render()
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    if(name === "anonymous"){
        req.flash("error", "user not registered");
    }else{
        req.flash("success", "user registered successfully");
    }

    res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
    res.render("page.ejs", {name: req.session.name});  // "success" key used.
});



// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){         // if exists then run this
//         req.session.count++;
//     }else{
//         req.session.count=1;       // if not exists
//     }
//     res.send(`you sent request ${req.session.count} times`);
// });

// app.get("/test", (req,res)=>{
//     res.send("successful!!"); 
// });

// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req,res)=>{
//     res.cookie("color", "red", {signed: true});
//     res.send("signed!!!!");
// })

// app.get("/verify", (req,res)=>{
//     console.log(req.signedCookies);
// })

// app.get("/getcookies", (req,res)=>{
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India");
//     res.send("cookies saved");
// });

// app.get("/", (req,res)=>{
//     console.dir(req.cookies);
//     res.send("i am root...");
// });

// app.get("/greet", (req,res)=>{
//     let {color = "anonymous"}= req.cookies;
//     res.send(`it's ${color}`);
// });

app.listen(3000, ()=>{
    console.log("connected");
});