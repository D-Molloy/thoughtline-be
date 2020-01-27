'use strict';
const bearerAuth = require('../lib/bearer-auth-middleware');



module.exports = router => {
  router.route('/loggedinuser/')
    
    .get(bearerAuth, (req, res) => {
      res.status(200).json(req.user);
    });
};