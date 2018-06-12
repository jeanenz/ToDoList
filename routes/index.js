var express = require("express");
var router = express.Router();
var Todo = require("../models/todo");
var User = require("../models/user");
var passport = require("passport");


// Route for today's todos
router.get("/", function(req, res){
    Todo.find({}, function(err, allTodos){
        if(err){
            console.log(err);
        } else{
            res.render("home", {todos: allTodos});
        }
    });
});

// Auth routes

// Show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/todos");
            });
        }
    });
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
});

// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } res.redirect("/login");
}

module.exports = router;