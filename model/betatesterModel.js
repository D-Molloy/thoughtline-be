'use strict';

const mongoose = require('mongoose');

const Beta = mongoose.Schema({
  first: {type: String, required: true},
  last: {type: String, required: true},
  email: {type: String, required: true},
}, {timestamps: true});
module.exports = mongoose.model('betas', Beta);