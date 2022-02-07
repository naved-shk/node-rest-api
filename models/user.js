const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unquie: true},
    password: {type: String, required: true},
    role: {type: String, default: 'customber'}
},{timestamps: true});


module.exports = mongoose.model('User', userSchema, 'users');