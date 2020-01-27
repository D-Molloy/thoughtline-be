'use strict';

const User = require('../model/userModel');
const Notification = require('../model/notifications');


// async function updateUser(userid, newuser) {
//   // console.log('in update user ======', userid, newuser);
//   let tempExistingUser = await User.findById(userid);
//   tempExistingUser.notifications.push(newuser);
//   let tempPending = 
//   tempExistingUser.pendingRequest.filter(el => {
//     return el !== newuser.email;
//   });
//   tempExistingUser.pendingRequest = tempPending;
//   // console.log('tempuser before save', tempExistingUser);
//   tempExistingUser.save();
// }
async function updateNotification(userid, newuser) {
  console.log('in update Notificatons');
  let newNotification = await new Notification({
    userId: `${userid}`,
    fromId: `${newuser._id}`,
    type: `Request`,
  }).save();
}

module.exports = function (newUser) {
  // console.log('searchid', newUser);
  return new Promise(resolve => {
    // console.log('in find-user');
    return User.find({pendingRequest: {$in: `${newUser.email}`}})
      .then(data => {
        if(data.length > 0) {
          // console.log('data', data);
          data.forEach(element => {
            updateNotification(element._id, newUser);           
          });
          
          resolve(data);
        } else {
          // console.log('in else');
          resolve('no user');
        }
      })
      .catch(err => console.error(err));

  });
};