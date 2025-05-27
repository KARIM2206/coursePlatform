const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['student','teacher', 'admin'],
        default: 'student',
    },
    
    avatar: {
        type: String,
        required: false,
    },
});
const User= mongoose.model('user', userSchema);

module.exports = {User};