'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const User = require('../model/userModel');
const bearerAuth = require('../lib/bearer-auth-middleware');
const Notifications = require('../model/notifications');


module.exports = router => {
  
  router.put('/acceptfriend/', bearerAuth, bodyParser, (req, res) => {
    // console.log('in accept frind route', req.body);
      
    User.findOne(req.user._id)
      
      .then(user => {
        if(req.body.friend){
          
            
          // console.log('user found', user);
          // console.log('req body friend', req.body.friend);
          if(!user.friends.includes(req.body.friend)) {
            // console.log('adding friend');
            // let z = JSON.stringify(req.body.friend);
            user.friends.push(req.body.friend);
            user.save();
            return;
          } else {
            return;
          }
           
        } else {
          Promise.reject(new Error('Authorization Failed. No friend specified'));
        }
      })
      .then(() => {
        res.sendStatus(204);

      })

      
      .catch(err => errorHandler(err, res));
        
  });

};