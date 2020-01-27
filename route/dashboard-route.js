'use strict';

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const Entries = require('../model/entriesModel');
const Priority = require('../lib/manage-priority');
const bearerAuth = require('../lib/bearer-auth-middleware');
const Target = require('../model/targetModel');
const User = require('../model/userModel');

module.exports = router => {
  
  // const importance = async function(userObject) {
  //   let count = await Entries.countDocuments({recipient: userObject._id});
  //   return count;
  // }
  function processObject(userObject) {
    let newObject = {
      _id: userObject._id,
      picture: userObject.picture,
      username:userObject.username,
      email: userObject.email,
      firstname: userObject.firstname ? userObject.firstname : '',
      lastname: userObject.lastname ? userObject.lastname : '',
      priority: false,
      isTarget: userObject.isTarget ? userObject.isTarget : false,
    }
    
    return newObject;

  }
  function countPromise(userObject) {
    
    return new Promise(resolve => {
      Entries.countDocuments({recipient: userObject._id})
        .then(count => {
          // console.log('_______________________')
          let newObject = processObject(userObject);
          newObject.count = count;
          return newObject;
          
        })
        .then(object => {
          // console.log('2nd _______________________', object);
          resolve (object);

        })
    });
  }

  async function processArray(array, sortby) {
    let tempArray = array;
    let returnArray = [];
    
    if(sortby === 'alpha') {
      array.forEach(element => {
        returnArray.push(processObject(element));
      });
      // console.log('in alpha sort return array', returnArray);
      returnArray.sort(function(a, b){
        if(a.lastname.toLowerCase() < b.lastname.toLowerCase()) { return -1; }
        if(a.lastname.toLowerCase() > b.lastname.toLowerCase()) { return 1; }
        return 0;
      })
    } else {
      // console.log('in count sort')
      
      for (let i = 0; i < tempArray.length; i++) {
        let temp = await countPromise(tempArray[i])
          returnArray.push(temp);
      }
      returnArray.sort(function(a,b) {return (b.count - a.count)});
    }
    // console.log('return array from sort', returnArray);
    return returnArray;
  }


  router.get('/dashboard/', bodyParser, bearerAuth, (req, res) => {
    let returnObject = [];
    let dashboardObject;
    // console.log('req.user', req.user);
    return Target.find({userId: req.user._id}).lean()
      .then(entries => {
        dashboardObject = entries.map(entry => {
          entry.isTarget = true;
          return entry;
        });
      })
      .then(() => {
        return User.find({_id: { '$in' : req.user.friends}}).lean();
      })
      .then(userEntries => {
        returnObject = dashboardObject.concat(userEntries);
        // console.log('return object', returnObject);
        return returnObject;
      })
      .then(array => {
        let testArray = processArray(array, req.user.sortby);
        
        return testArray;
      })
      .then(testArray => {
        // console.log('in priority section')

        let dashArray = Priority(testArray, req.user.priority);
        return dashArray;
      })
      // .then(array => {
      //   console.log('after count function  ', array);
      //   return array;
      // })
      .then(testArray => {
        // console.log('test array before sending', testArray);
        res.status(200).json(testArray);
      })
      .catch(err => errorHandler(err, res));
  });
};