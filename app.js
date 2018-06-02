var express = require("express"),
    methodOverride = require("method-override"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

//App config
mongoose.connect("mongodb://localhost/todo_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//Mongoose / model config
var todoSchema = new mongoose.Schema({
    item: String,
    category: String,
    created: {type: Date, default: Date.now}
});
var Todo = mongoose.model("Todo", todoSchema);

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


// Route for today's todos
app.get("/", function(req, res){
    Todo.find({}, function(err, allTodos){
        if(err){
            console.log(err);
        } else{
            res.render("home", {todos: allTodos});
        }
    });
});

//RESTful routes

//Index route
app.get("/todos", function(req, res){
    Todo.find({}, function(err, allTodos){
        if(err){
            console.log(err);
        } else{
            res.render("todos", {todos: allTodos});
        }
    });
});

//New route
app.get("/todos/new", function(req, res){
    res.render("new");
});

//Create route
app.post("/", function(req, res){
    console.log (req.body.todo);
    Todo.create(req.body.todo, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

// Show route
app.get("/todos/:id", function(req, res) {
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            console.log(err);
        } else{
            res.render("show", {todo: foundTodo});
        }
    });
});

// Edit route
app.get("/todos/:id/edit", function(req, res){
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            console.log(err);
        } else{
            res.render("edit", {todo: foundTodo});
        }
    });
});

//Update route
app.put("/todos/:id", function(req, res){
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo){
        if(err){
            console.log(err);
        } else {
            res.redirect("/todos/" + req.params.id);
        }
    });
});

// Destroy route
app.delete("/todos/:id", function(req, res){
    Todo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/todos");
        }
    });
});

// Auth routes

// Show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//Handle sign up logic
app.post("/register", function(req, res){
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
app.get("/login", function(req, res) {
    res.render("login");
});

// Handling login logic
app.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
});

// Logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Your to do list is listening");
});