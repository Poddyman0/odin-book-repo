const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    profilePictureURL: { type: String, required: true},
    profileInfo: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    followingRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
    followingAcceptance: [{type: Schema.Types.ObjectId, ref: "User"}],
    followersRequest: [{type: Schema.Types.ObjectId, ref: "User"}],
    followersAcceptance: [{type: Schema.Types.ObjectId, ref: "User"}]
})



module.exports = mongoose.model("User", UserSchema);