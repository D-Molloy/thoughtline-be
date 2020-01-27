'use strict';

// const faker = require('faker');
const mocks = require('../__test__/lib/mocks');
const server = require('../lib/server');
require('dotenv').config({ path: `../__test__/.test.env` });

server.start();
// let userTest = mocks.auth.createOne();
// console.log('test user creation', userTest);
server.stop();

