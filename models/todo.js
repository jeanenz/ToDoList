var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Mongoose / model config
var TodoSchema = new mongoose.Schema({
    item: String,
    category: String,
    created: {type: Date, default: Date.now}
});
TodoSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Todo", TodoSchema);