'use strict';

const bodyParser = require('body-parser').json({limit: '50mb'});
const errorHandler = require('../lib/error-handler');
const Entry = require('../model/entriesModel');
const User = require('../model/userModel');
const bearerAuth = require('../lib/bearer-auth-middleware');
const FileUpload = require('../file_upload');


module.exports = router => {
  router.route('/entry/:id?')
    .post(bearerAuth, bodyParser, (req, res) => {
      req.body.userId = req.user._id;

      let entryToCreate = new Entry(req.body);
      // console.log("________________");    
      // console.log('test entry', req.body.recipient);
      if(!req.body.deliverOn) {
        console.log('in set deliverOn', req.body.deliverOn);
        entryToCreate.deliverOn = Date.now();
      }
      //this is if there is a image included in request
      if(req.body.image) {
        // console.log('the req has image');
        return FileUpload(req.body.image, entryToCreate._id)
          .then(data => {
            entryToCreate.image = data.Location;
            // console.log('data from file upload', data.Location);
            return;
          })
          .then(() => {
            // console.log('entry to save', entryToCreate);
            return entryToCreate.save();
          })
          .then(createdEntry => res.status(201).json(createdEntry))
          .catch(err => errorHandler(err, res));
      } else {
        return entryToCreate.save()
          .then(createdEntry => {console.log('entry created', createdEntry);})
          .then(createdEntry => res.status(201).json(createdEntry))
          .catch(err => errorHandler(err, res));

      }

    })
  // this is working
    .get(bearerAuth, (req, res) => {
      if(req.params.id) {
        return Entry.findById(req.params.id)
          .then(entry => {
            res.status(200).json(entry);

          })
          .catch(err => errorHandler(err, res));
      }

      return Entry.find({userId : req.user._id})
        .then(entry => {
          // console.log('in get all entries');
          // this makes no sense fix
          let entryIds = entry.map(ent => ent._id);

          res.status(200).json(entryIds);
        })
        .catch(err => errorHandler(err, res));
    })
  //this is working 
    .put(bearerAuth, bodyParser, (req, res) => {
      if(!req.params.id) {
        return errorHandler(new Error('validation failed, no entry id specified'), res);
      }
      Entry.findById(req.params.id)
        .then(entry => {
          if(!entry) return Promise.reject(new Error('Authorization error'));
          entry.deliverOn = req.body.deliverOn ? new Date(req.body.deliverOn) : entry.deliverOn;
          entry.recipient = req.body.recipient ? req.body.recipient : entry.recipient;
          entry.mood = req.body.mood ? req.body.mood : entry.mood;
          entry.description = req.body.description ? req.body.description : entry.description;
          entry.read = req.body.read ? req.body.read : entry.read;
          entry.delivered = req.body.delivered ? req.body.delivered : entry.delivered;
          return entry.save();        
        })
        .then(deliveredEntry => {
          if(req.body.delivered) {
            User.findById(deliveredEntry.recipient)
              .then(user => {
                user.newmessages.push(`${req.user.id}`);
                return user.save();

              });
            return;
          } else {
            return;
          }
        })
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    })
  //  this is working
    .delete(bearerAuth, (req, res) => {
      if(!req.params.id) {
        return errorHandler(new Error('validation failed, no entry id specified'), res);
      }

      return Entry.findById(req.params.id)
        .then(entry => {
          if(entry) return entry.remove();
          Promise.reject(new Error('objectid failed'));
        })
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    });
  

};

