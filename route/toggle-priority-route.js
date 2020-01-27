'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const User = require('../model/userModel');
const bearerAuth = require('../lib/bearer-auth-middleware');


module.exports = router => {
  
  router.put('/togglepriority/', bearerAuth, bodyParser, (req, res) => {
    
      
    User.findOne(req.user._id)
      .then(user => {
        if(user) {
          if(!user.priority.includes(req.body.priority)) {
            user.priority.push(req.body.priority);
            user.save();
            console.log('saved user in toggle priority', user);
            return user;

          } else {
            user.priority = user.priority.filter(el => el !== req.body.priority);
            user.save();
            console.log('saved user in toggle priority', user);
            return user;
          }
        } else {
          Promise.reject(new Error('Authorization Failed. No user found'));
        }
      })
      
      .then(() => {
        res.sendStatus(204);

      })

      
      .catch(err => errorHandler(err, res));
        
  });

};