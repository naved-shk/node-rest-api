const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    token: {type: String, unquie: true},
},{timestamps: false});


module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens');