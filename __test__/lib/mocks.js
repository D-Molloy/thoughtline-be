'use strict';

module.exports = {};

const Target = require('../../model/targetModel');
const UserModel = require('../../model/userModel');
const Entry = require('../../model/entriesModel');

const faker = require('faker');

const mocks = module.exports = {};
mocks.auth = {};

mocks.auth.createOne = function() {
  let result = {};

  let user = new UserModel({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  return user.generatePasswordHash(user.password)

    .then(user => result.user = user)
    .then(user => user.generateToken())
    .then(token => result.token = token)
    .then(() => {
      return result;
    });
};

mocks.target = {};
mocks.target.createOne = () => {
  let result = {};

  return mocks.auth.createOne()
    .then(user => result.user = user)
    .then(user => {
      return new Target({
        name: faker.name.firstName(),
        userId: user.user._id,
      }).save();
    })
    .then(target => {
      result.target = target;
      return result;
    });
};

mocks.entry = {};
mocks.entry.createOne = function(){
  let result = {};


  return mocks.target.createOne()
    .then(target => {
      result.target = target;
      // console.log('target.user.user._id', target.user.user._id);
      return new Entry({
        userId: target.user.user._id,
        recipient: target.target._id,
        mood: faker.lorem.word(),
        description: faker.lorem.words(10),
      }).save();
    })
    .then(entry => {
      result.entry = entry;
      return result;
    });
};




mocks.auth.removeAll = () => Promise.all([UserModel.remove()]);
mocks.target.removeAll = () => Promise.all([Target.remove()]);
mocks.entry.removeAll = () => Promise.all([Entry.remove()]);