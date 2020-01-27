'use strict';

const findUserNotice = require('./create-notifications');

testthething = (testemail) => {

  return findUserNotice(testemail).then(data => console.log(data));
}

console.log('result =====', result);