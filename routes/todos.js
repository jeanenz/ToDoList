var express = require("express");
var router = express.Router();
var Todo = require("../models/todo");

//RESTful routes

//Index route
router.get("/todos", isLoggedIn, function(req, res){
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
router.post("/", function(req, res){
    // Get user info to add to todo
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newTodo = req.body.todo;
    newTodo.author = author;
    console.log (newTodo);
    Todo.create(newTodo, function(err, newlyCreated){
        if(err){
            console.log("This is an error message:" + err);
        } else {
            res.redirect("/");
        }
    });
});

// Show route
router.get("/todos/:id", isLoggedIn, function(req, res) {
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            console.log(err);
        } else{
            res.render("show", {todo: foundTodo});
        }
    });
});

// Edit route
router.get("/todos/:id/edit", checkTodoOwnership, function(req, res){
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            console.log(err);
        }
        res.render("edit", {todo: foundTodo});        
    });
});


//Update route
router.put("/todos/:id", isLoggedIn, function(req, res){
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo){
        if(err){
            console.log(err);
        } else {
            res.redirect("/todos/" + req.params.id);
        }
    });
});

// Destroy route
router.delete("/todos/:id", isLoggedIn, function(req, res){
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

function checkTodoOwnership(req, res, next){
    if(req.isAuthenticated()){
        Todo.findById(req.params.id, function(err, foundTodo){
            if(err){
                res.redirect("back");
            } else{
                // Is this the user's todo?
                if(foundTodo.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;