var express = require("express");
var router = express.Router();
var Todo = require("../models/todo");

//RESTful routes

//Index route
router.get("/todos", function(req, res){
    Todo.find({}, function(err, allTodos){
        if(err){
            console.log(err);
        } else{
            res.render("todos", {todos: allTodos});
        }
    });
});

//New route
router.get("/todos/new", isLoggedIn, function(req, res){
    res.render("new");
});

//Create route
router.post("/", isLoggedIn, function(req, res){
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
router.get("/todos/:id", function(req, res) {
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            console.log(err);
        } else{
            res.render("show", {todo: foundTodo});
        }
    });
});

// Edit route
router.get("/todos/:id/edit", function(req, res){
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            console.log(err);
        } else{
            res.render("edit", {todo: foundTodo});
        }
    });
});

//Update route
router.put("/todos/:id", function(req, res){
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo){
        if(err){
            console.log(err);
        } else {
            res.redirect("/todos/" + req.params.id);
        }
    });
});

// Destroy route
router.delete("/todos/:id", function(req, res){
    Todo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/todos");
        }
    });
});

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } res.redirect("/login");
}

module.exports = router;