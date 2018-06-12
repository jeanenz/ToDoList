var express = require("express"),
    methodOverride = require("method-override"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Todo = require("./models/todo");

var todoRoutes = require("./routes/todos"),
    indexRoutes = require("./routes/index");

//App config
mongoose.connect("mongodb://localhost/todo_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Passport configuration
app.use(require("express-session")({
    secret: "Oscar and Bravo are both napping today",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(todoRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Your to do list is listening");
});