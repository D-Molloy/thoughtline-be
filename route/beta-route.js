'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const Beta = require('../model/betatesterModel');

module.exports = router => {
  router.route('/beta/:email?')
    .get(bodyParser, (req, res) => {
      console.log('req.params' ,req.params);
      Beta.find({email: req.params.email})
        .then(results => {
          if(results.length > 0) {
            res.sendStatus(302);
          }
          if(!results || results.length < 1) {
            res.sendStatus(404);
          }
        })
        .catch(err => errorHandler(err, res));
    })
    .post(bodyParser, (req, res) => {
      let test = new Beta(req.body);
      return test.save()
        .then(beta => res.status(201).json(beta))
        .catch(err => errorHandler(err, res));
    });
  
};