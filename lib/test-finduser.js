'use strict';

const findUser = require('../lib/find-user');

const idtosearch =  '5c5236db390291b651b19a4f';

// let result = findUser(idtosearch);
// console.log('this is a test of find user', result);

async function test(idtosearch) {
  let awaitresponse = await findUser(idtosearch);
  // console.log('awaited response', awaitresponse);
}

test(idtosearch).then(x => console.log('in .then',x));