'use strict';

const User = require('../model/targetModel');

module.exports = router => {

  router.route('/changealldefaultimages')

    .put((req, res) => {
      User.updateMany({
        picture: { $eq : 'https://img.icons8.com/android/100/000000/user.png'}}, 
      {picture: 'https://png.pngtree.com/svg/20160319/49805b8c9c.svg',
      })
        .then(data => {
          console.log('data from change all');
          res.status(201).json(data);
        });
    });
};