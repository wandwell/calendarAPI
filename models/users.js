const { Schema, model} = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String, 
    favorites: Array,
    dislikes: Array
}, { collection: 'users'})

const User = model('User', userSchema);
module.exports = { User };