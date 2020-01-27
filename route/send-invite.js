'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const sendEmail = require('../lib/sendnodemailer');
const User = require('../model/userModel');

const bearerAuth = require('../lib/bearer-auth-middleware');
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

module.exports = router => {
  router
    .route('/sendinvite/')

    .post(bearerAuth, bodyParser, (req, res) => {
      if(req.user.pendingRequest.includes(req.body.email)) {
        res.sendStatus(209);
        
      } else {
        if (req.body.email) {
          if (!validateEmail(req.body.email)) {
            return errorHandler(
              new Error('validation failed, not a valid email format'),
              res
            );

          }
          return sendEmail(req)
            .then(data => {
              // console.log('data back from send nodemailer', data);
              User.findById(req.user._id)
                .then(user => {
                  if (!user.pendingRequest.includes(`${req.body.email}`)) {
                    user.pendingRequest.push(req.body.email);
                    user.save();
                  }
                })
                .catch(err => errorHandler(err, res));
              return data;
            })
            .then(data => {
              // console.log('data back from send email', data.accepted[0]);
              res.status(200).json(data);
            })
            // .catch(err => errorHandler(err, res));
            .catch(err => console.log(err));
        }
        if (!req.body.email)
          return errorHandler(
            new Error('validation failed, no email specified'),
            res
          );
      }
        
    });
};
