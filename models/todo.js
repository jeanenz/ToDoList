var mongoose = require("mongoose");

//Mongoose / model config
var TodoSchema = new mongoose.Schema({
    item: String,
    category: String,
    created: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("Todo", TodoSchema);