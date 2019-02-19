let moment = require('moment');

let someTimestamp = moment().valueOf();
console.log(someTimestamp);
let createAt = 1234;
let date = new moment(createAt);
console.log(date.format('MMM Do, YYYY - HH:mm'));