const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User"},
    content:  { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    client_offset:  { type: String, required: true},
    recipient: {type: Schema.Types.ObjectId, ref: "User"},
    roomId: {
        type: String,
        required: true
      }
})



module.exports = mongoose.model("Message", MessageSchema);