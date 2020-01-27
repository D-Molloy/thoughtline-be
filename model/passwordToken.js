'use strict';

const mongoose = require('mongoose');

const PasswordToken = mongoose.Schema({
  email : { type: String, required: true, unique: true},
  token : { type: String, required: false, unique: true},
}, {timestamps: true});



module.exports = mongoose.model('passwords', PasswordToken);