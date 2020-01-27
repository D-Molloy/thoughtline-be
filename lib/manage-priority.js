'use strict';
module.exports = function (array1, array2) {
  //array1 is array of userObjects for dashboard
  //array2 is array of userId's that are priority
  //remove users from array if they are in priority and sort leftover array 
  // add priority users back to front of array
  let priorityArray = [];
  let leftover = array1.filter(el => {
    if(array2.includes(`${el._id}`)) {
      el.priority = true;
      priorityArray.push(el);
    } else {
      return el;
    }
  });
 
  let returnArray = priorityArray.concat(leftover);
  return returnArray;
};

