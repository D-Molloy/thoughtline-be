'use strict';

const mongoose = require('mongoose');

const Notification = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel'},
  fromId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel'},
  description: {type: String, required: false },
  type: { type: String, required: false},
  read: { type: Boolean, default: false}, 
}, {timestamps: true});



module.exports = mongoose.model('notifications', Notification);