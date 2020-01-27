'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const User = require('../model/userModel');
const Target = require('../model/targetModel');
// const Notification = require('../model/notifications');
const bearerAuth = require('../lib/bearer-auth-middleware');

// this route will remove the friend link from one side only.
// it will take the friend id out of the friends array as well as the priority array.
module.exports = router => {
  
  router.put('/deletefriend/', bearerAuth, bodyParser, (req, res) => {
  
    if(req.user.friends.includes(req.body.friend)) {
      User.findOne(req.user._id)
        .then(user => {
          if(user) {
            let newFriendsArray, newPriorityArray = [];
            newFriendsArray = user.friends.filter(el => el !== req.body.friend);
            newPriorityArray = user.priority.filter(friend => friend !== req.body.friend);
            user.friends = newFriendsArray;
            user.priority = newPriorityArray;
            user.save();
            return user;
          } else {
            Promise.reject(new Error('Authorization Failed. No user found'));
          }
        
        })
        .then(() => {
          // console.log('user found and removed from array');
          res.sendStatus(204);
        })
        .catch(err => errorHandler(err, res));
        
    } else {
      Target.findById(req.body.friend)
        .then(data => {
          // console.log('data from delete one', data); 
          return data.remove();
          
        })
        .then(() => {
          if(req.user.priority.includes(req.body.friend)) {
            User.findById(req.user._id)
              .then(user => {
                let newPriorityArray = user.priority.filter(friend => friend !== req.body.friend);
                user.priority = newPriorityArray;
                return user.save();
              });
          }
        })
        .then(() => {
          res.sendStatus(204);
        })
        .catch(err => errorHandler(err, res));
    }

  });
};