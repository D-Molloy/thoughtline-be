'use strict';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userModel = mongoose.Schema({
  username : { type: String, required: true, unique: true},
  firstname : { type: String, required: false},
  lastname : { type: String, required: false},
  email : { type: String, required: true, unique: true},
  password : { type: String, required: true},
  picture : { type: String, required: false, default:'https://img.icons8.com/android/100/000000/user.png'},
  tokenSeed : { type: String, unique: true},
  phoneNumber : { type: String, required: false},
  lastLogin: { type: Date, default: Date.now()},
  sortby: { type: String, required: false, default:'alpha'},
  loginarray: [{type: Date, required: false}],
  priority: [],
  friends: [],
  notifications:[],
  newmessages: [],
  pendingRequest : [],
}, {timestamps: true});

// This hashes the password and stores it in hashed form
userModel.methods.generatePasswordHash = function(password) {
  if(!password) return Promise.reject(new Error('Authorization failed. Password required.'));
  return bcrypt.hash(password, 10)
    .then(hash => this.password = hash)
    .then(() => this)
    .catch(err => err);
};
//this takes the password from the request and hashes it to compare to hased password
userModel.methods.comparePasswordHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(new Error('Authorization failed. Password invalid.'));
      resolve(this);
    });
  });
};
// generates the token seed to create user tokens
userModel.methods.generateTokenSeed = function() {
  this.tokenSeed = crypto.randomBytes(64).toString('hex');
  return this.save()
    .then(() => Promise.resolve(this.tokenSeed))
    .catch(console.error);
};
// generates a token to send back to the client
userModel.methods.generateToken = function() {
  return this.generateTokenSeed()
    .then(tokenSeed => {
      return jwt.sign({token: tokenSeed}, process.env.APP_SECRET);
    })   
    .catch(err => err);
};
userModel.methods.updateLogin = function () {
  this.lastLogin = Date.now();
  this.loginarray.push(Date.now());
  return this.save()
    .then(() => Promise.resolve(this))
    .catch(console.error);
};



module.exports = mongoose.model('userModel', userModel);