const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    userId: String,
    date: Date,
    meal: String,
    recipeId: String,
    name: String,
    servings: Number,
}, { collection: 'events' });

const Event = model('Event', eventSchema);
module.exports = { Event };
