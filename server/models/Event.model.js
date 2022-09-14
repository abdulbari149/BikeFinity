const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
    type: { type: String },
    title: { type: String },
    venue: { type: String },
    date: { type: Date },
    image: { type: String },
    description: { type: String },
    interested: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }],
    status: { type: String, default: 'Active' },
    hostedBy: { type: Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);