const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let adSchema = new Schema({
    title: { type: String },
    price: { type: Number },
    year: { type: Number },
    make: { type: String },
    model: { type: String },
    engine: { type: Number },
    kilometers: { type: Number },
    condition: { type: String },
    description: { type: String },
    location: { type: String, default: 'Karachi' },
    image: { type: String },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" , default: null}],
    postDate: { type: Date, default: Date.now },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" }, //user_id from req.decoded
    status: { type: String, default: "Active" },
});

module.exports = mongoose.model('Ad', adSchema);