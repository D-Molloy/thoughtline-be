'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');


const Target = require('../model/targetModel');
const bearerAuth = require('../lib/bearer-auth-middleware');
const uploadPic = require('../file_upload');


module.exports = router => {
  router.route('/target/:id?')
    .post(bearerAuth, bodyParser, (req, res) => {
      // console.log('in target route post!!');
      req.body.userId = req.user._id;
      // console.log('in create new target', req.body.image);
      if (!req.body.image) {
        return new Target(req.body).save()
          .then(createdEntry => res.status(201).json(createdEntry))
          .catch(err => errorHandler(err, res));
      }
      if(req.body.image) {
        let targetImage = req.body.image;
        req.body.image = null;
        let targetTemp = new Target(req.body);
        return uploadPic(targetImage,targetTemp._id)
          .then(data =>{
            targetTemp.picture = data.Location;
            return targetTemp;
          })
          .then(target => target.save())
          .then(createdEntry => res.status(201).json(createdEntry))
          .catch(err => errorHandler(err, res));

      }
    })
  // this is working
    .get(bearerAuth, (req, res) => {
      //console.log('request params',req.params.id);
      if(req.params.id) {
        
        return Target.findById(req.params.id)
          .then(entry => res.status(200).json(entry))
          .catch(err => errorHandler(err, res));
      }

      return Target.find({userId: req.user._id})
        .then(entries => {
          // console.log('in get all entries');
          // let entryIds = entry.map(ent => ent._id);

          res.status(200).json(entries);
        })
        .catch(err => errorHandler(err, res));
    })
  //this is working 
    .put(bearerAuth, bodyParser, (req, res) => {
      if(!req.params.id) {
        return errorHandler(new Error('validation failed, no target id specified'), res);
      }
      Target.findById(req.params.id)
        .then(entry => {
          if(!entry) return Promise.reject(new Error('Authorization error'));
          return entry.set(req.body).save();        
        })
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    })
  // //  this is working
    .delete(bearerAuth, (req, res) => {
      if(!req.params.id) {
        return errorHandler(new Error('validation failed, no target id specified'), res);
      }
      return Target.findById(req.params.id)
        .then(targetEntry => {
          // console.log('deleted target entry', targetEntry);
          if(targetEntry)
            return targetEntry.remove();
          Promise.reject(new Error('objectid failed'));
        })
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    });
};