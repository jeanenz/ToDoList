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
    frequency:  Number,
    repeat: {
        type: Boolean,
        default: false
    },
    lastCompleted: Date,
    nextDo: Date
});

module.exports = mongoose.model("Todo", TodoSchema);