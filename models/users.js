const { Schema, model } = require('mongoose');

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        validate: {
            validator: validatePassword,
            message: props => `${props.value} is not a valid password. Password must include an uppercase letter, a lowercase letter, and a number.`
        }
    },
    favorites:[{ recipeId: String, title: String }],
    dislikes: [String],
}, { collection: 'users' });

const User = model('User', userSchema);
module.exports = { User };
