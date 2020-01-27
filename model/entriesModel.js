'use strict';

const mongoose = require('mongoose');

const Entry = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel'},
  recipient: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'targetModel'},
  mood: {type: String, required: false},
  description: {type: String, required: false },
  delivered: { type: Boolean, default: false },
  read: { type: Boolean, default: false}, 
  deliverOn: { type: Date, required: false},
  image: {type: String, required: false},
}, {timestamps: true});



module.exports = mongoose.model('entries', Entry);