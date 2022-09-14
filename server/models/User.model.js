const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String },
    email: { type: String, trim: true, lowercase: true },
    contactNumber: { type: Number },
    location: { type: String },
    password: { type: String },
    profilePicture: { type: String, default: "https://res.cloudinary.com/dl28pe0lw/image/upload/v1647105655/avatar_l36vgl.jpg" },
    likedAds: [{ type: Schema.Types.ObjectId }],
    joinedDate: { type: Date, default: Date.now },
    status: { type: String, default: "Active" },
    resetCode: { type: String, default: null },
    resetCodeExpiry: { type: Date, default: null },
});

module.exports = mongoose.model('User', userSchema);