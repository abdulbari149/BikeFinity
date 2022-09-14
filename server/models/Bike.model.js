const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bikeSchema = new Schema({
    make: { type: String },
    model: { type: String },
    engine: { type: Number },
    image: {type: String},
    type: {type: String},
    counterReviews: {type: Number, default: 0},
    averageRating: {type: Number},
});

module.exports = mongoose.model('Bike', bikeSchema);