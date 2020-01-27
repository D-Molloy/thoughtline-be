'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth-middleware');
const User = require('../model/userModel');
const Entry = require('../model/entriesModel');

// this will clear the notification flag from the new messages array of the user.
module.exports = router => {
  router.route('/inboxclearnotification/')
    .put(bearerAuth, bodyParser, (req, res) => {
    
      if (req.body.sender) {
        // console.log('user', req.user.id);
        // console.log('req.body.sender', req.body.sender);
        if(req.user.newmessages.includes(`${req.body.sender}`)) {
          User.findOne({_id: req.user.id})
            .then(user => {
              let temp = user.newmessages.filter(el => el !== `${req.body.sender}`);
              user.newmessages = temp;
              user.save();
              return;
            })
            .then(() => {
              return Entry.updateMany({
                userId: req.body.sender,
                recipient: req.user.id,
                delivered: true,
                read: false,
                deliverOn: {'$lte': Date.now()},
              }, {read: true});
                // .then(results => {
                //   // console.log('results of entryfind in inboxclearnotifications', results);
                //   return;
                // });
                
            })
            .then(() => {
              res.sendStatus(204);
            })
            .catch(err => errorHandler(err, res));
        }
      }
  
      if (!req.body.sender) {
        return errorHandler(
          new Error('objectid failed, no recipient specified'),
          res
        );
      }
    });
};
