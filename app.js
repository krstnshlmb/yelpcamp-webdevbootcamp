//Required As First Package
require('dotenv').config();

//Dependencies For Application
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    expressSanitizer = require("express-sanitizer"),
    helmet = require('helmet'),
    cookieParser = require("cookie-parser");


//Safeguard 
app.use(helmet());

//Mongoose Related
mongoose.Promise = global.Promise;


//Temp Data
//seedDB = require("./seeds");

//-----------------------------------------------------------------------------//
//-----------------------------------Modules-----------------------------------//
//-----------------------------------------------------------------------------//

//Campground Ground Schema File
var Campground = require("./models/campground");

//Campground Ground Schema File
var Comment = require("./models/comments");

var User = require("./models/user");

var request = require("request");

// Routes

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var userRoutes = require("./routes/user");
var forgotRoutes = require("./routes/forgot");

//Database connection
                    
var db = process.env.DATABASEURL || "mongodb://localhost/yelpcamp";
mongoose.connect(db);


//Sets view engine as ejs
app.set("view engine", "ejs");

//Receives data from forms
app.use(bodyParser.urlencoded({ extended: true }));

//Public directory
app.use(express.static(__dirname + "/public"));

//Used For Put Request 
app.use(methodOverride("_method"));

//Connect Flash
app.use(flash());

//Moment JS
app.locals.moment = require('moment');

//Sanitizer
app.use(expressSanitizer());

//Cookie Parser
app.use(cookieParser());




//Passport JS configuration

app.use(require("express-session")({
    secret: "Once Again Rusty Is The Best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Custom Middleware

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//"Placeholder" for routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/users/", userRoutes);
app.use(forgotRoutes);



//404 - when a non-predefined route is attempted to be accessed

app.get("*", function (req, res) {
    res.render("404");
});

var port = 3000 ;

app.listen(port, function () {
    console.log("Welcome To The YelpCamp Server");
});
