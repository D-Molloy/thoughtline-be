'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');


const User = require('../model/userModel');
const Notification = require('../model/notifications');
const bearerAuth = require('../lib/bearer-auth-middleware');



module.exports = router => {
  

  router.route('/notifications/:id?')
    
    .get(bearerAuth, bodyParser, (req, res) => {
      return Notification.find({userId: req.user._id}).populate('fromId')
        .then(entrys => {
           
          res.status(200).json(entrys);
           
        })
        .catch(err => errorHandler(err, res));
    })
    .delete(bearerAuth, (req, res) => {
      // console.log('in delete notifications route');
      if(!req.params.id) {
        return errorHandler(new Error('validation failed, no entry id specified'), res);
      }

      return Notification.findById(req.params.id)
        .then(notification => {
          // console.log('notification found', notification);
          if(notification) return notification.remove();
          Promise.reject(new Error('objectid failed'));
        })
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    });

    
};     
  
   
