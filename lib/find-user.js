'use strict';

const User = require('../model/userModel');

module.exports = function (searchId) {
  return new Promise(resolve => {
    console.log('in find-user');
    return User.find({email: `${searchId}`})
      .then(data => {
        if(data.length > 0) {
          console.log('data', data)
          resolve(data);
        } else {
          console.log('in else');
          resolve('no user');
        }
      })
      .catch(err => console.error(err));

  });
};