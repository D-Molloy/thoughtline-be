'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const Entry = require('../model/entriesModel');
const bearerAuth = require('../lib/bearer-auth-middleware');
const Target = require('../model/targetModel');
const User = require('../model/userModel');


module.exports = router => {
  router.route('/changetargettouser/:id?')
    
  
    .put(bearerAuth, bodyParser, (req, res) => {
      if(!req.query.id) {
        return errorHandler(new Error('validation failed, no entry id specified'), res);
      }
      // console.log('user info', req.query.id , req.body.newUser);
      Entry.updateMany({userId: req.user.id, recipient: req.query.id}, {recipient: `${req.body.newUser}`})
        .then(results => {
          // console.log('results', results);
          if(!results) return Promise.reject(new Error('Authorization error'));
                  
        })
        .then(() => {
          return Target.deleteOne({_id: req.query.id})
            .catch(err => errorHandler(err, res));
        })
        .then(() => {
          return User.find({_id: req.body.newUser})
            .then(user => {
              // console.log('new user found###########', user[0]);
              res.status(202).json(user[0]);
            })
            .catch(err => errorHandler(err, res));
          
        })
        .catch(err => errorHandler(err, res));
    });
  
    
  

};