'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const passwordToken = require('../model/passwordToken');
const uuidv4 = require('uuid/v4');
const User = require('../model/userModel');
const sendPasswordEmail = require('../lib/send-password-reset-email');
const sendUserName = require('../lib/send-username');
module.exports = router => {
  router.route('/createpasswordemail/') 
    .post(bodyParser, (req,res) => {
      // make sure that the email is a valid user
      User.find({email: req.body.email})
        .then(results => {
          //if there is a result
          if(results.length > 0){
            //check to see if we already have a reset token for email address
            passwordToken.find({email: req.body.email})
              .then(data => {
                // we already have one delete it
                if(data.length > 0) {
                  return data[0].remove();
                } else {
                  return ;
                }
              })
              .then(() => {
                // no current token create a new one
                let testToken = uuidv4();
                let newEntry = new passwordToken({
                  email: req.body.email,
                  token: testToken,
                });
                return newEntry.save();

              })
              .then(entry => {
                //send the required ifo to the sendPasswordEmail function
                return sendPasswordEmail(entry.email, entry.token);
              })
              .then(data => {
                res.status(201).json(data);
              });
              

          } else {
            res.status(404).json('not found');
          }
        })
        
        .catch(err => errorHandler(err, res));

      

    });
  router.route('/acceptnewpassword/')
    .post(bodyParser, (req, res) => {
      //look for a password token
      passwordToken.find({email: req.body.email, token: req.body.token,  createdAt: { $gt: new Date(Date.now() - 24*60*59 * 1000) } })
        .then(result => {
          // if we have a valid token let the client know that the token is valid
          if(result.length > 0) {
            res.sendStatus(201);
          }
          // no valid token let the cleint know
          if(result.length === 0 ) {
            res.sendStatus(404);
          }
        })
        .catch(err => errorHandler(err, res));
    })
    .put(bodyParser, (req, res) =>{
      passwordToken.find({email: req.body.email, token: req.body.token,  createdAt: { $gt: new Date(Date.now() - 24*60*59 * 1000) } })
        .then(result => {
          
          if(result.length > 0) {
            return result[0].remove()
              .then(() => {
                User.findOne({email: req.body.email})
                  .then(result => {
                    return result.generatePasswordHash(req.body.password);
                  })
                  .then(user => {
                    return user.save();
                  })
                  .then(() => {
                    res.sendStatus(204);
                  });

              });
          } else {
            res.sendStatus(404);
          }
        })
        .catch(err => errorHandler(err, res));
    });
  router.route('/sendusername/:email?')
    .get(bodyParser, (req, res) => {
      
      if(req.params.email) {
        User.findOne({email: req.params.email})
          .then(result => {
            if(!result) throw new Error('objectid failed');
            return sendUserName(req.params.email, result.username);
          })
          .then(data => {
            if(data.accepted.length > 0) {
              res.status(200).json(data);
            } else {
              res.status(400).json(data);
            }
          })
          .catch(err => errorHandler(err, res));
      } else {
        res.status(404).json('no email specified');
      }
    });
   
};