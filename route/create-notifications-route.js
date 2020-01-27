'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const User = require('../model/userModel');
const bearerAuth = require('../lib/bearer-auth-middleware');

function searchForUser (searchId) {
  
  return new Promise(resolve => {
    User.find({email: `${searchId}`})
      .then(data => {
        if(data.length > 0) {
          resolve(data);
        } else {
          resolve('no user');
        }
      })
      .catch(err => console.error(err));

  });
};


module.exports = router => {
  
  async function boo(user) {
    let tempPendingRequest = [];
    // console.log('in function boo', user)
    for(let i = 0; i < user.pendingRequest.length; i++ ) {
      let tempId = await searchForUser(`${user.pendingRequest[i]}`);
      if(tempId !== 'no user') {
        user.notifications.push(tempId[0]);
        tempPendingRequest = user.pendingRequest.filter(el => {
         return el !== tempId[0].email;
        })

      }
    }
    user.pendingRequest = tempPendingRequest;
    user.save();
    return user;
  };

  router.route('/createnotifications/')
    
    .get(bearerAuth, bodyParser, (req, res) => {
      // console.log('in get route createnot', req.user);
      
      if(req.user.pendingRequest.length > 0) {
        return boo(req.user)
          .then(data => {
            res.status(200).json(data);
          })
          .catch(err => console.log('this is an error', err));
      } else {
        res.status(201).json('no pending requests found');
      }
       
  
    });
};