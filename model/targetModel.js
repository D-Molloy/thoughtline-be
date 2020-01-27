const mongoose = require('mongoose');

const targetModel = mongoose.Schema({
  username : { type: String, required: true},
  email : { type: String, required: false},
  picture : { type: String, required: false, default:'https://png.pngtree.com/svg/20160319/49805b8c9c.svg'},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel'},
  entries : [{type: mongoose.Schema.Types.ObjectId,  ref: 'entries'}],
  photo : {type: String, required: false},
  
  
}, {timestamps: true});

module.exports = mongoose.model('targetModel', targetModel);