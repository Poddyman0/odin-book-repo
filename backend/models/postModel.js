const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: { type: String, required: true},
    postImageURL: { type: String},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    
})



module.exports = mongoose.model("Post", PostSchema);