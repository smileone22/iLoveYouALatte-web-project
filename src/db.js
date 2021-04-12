// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// Users
// * our site requires authentication.
// * so users have a username and password
const User = new mongoose.Schema({
  username: {type: String, required: true},// username 
  password: {}// password hash 
  myCafe:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cafe' }]
});

// a Cafe
// * includes name, location, reviewurl, and a list of user information who saved the cafe.
const Cafe = new mongoose.Schema({
  name: {type: String, required: true},
  location: {type: String, required: true},
  reviewurl: String,
  savedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

// My cafe List
// This is a list of cafes that the user saved or registerd. 
// * each list must have a related user.
// * each list may have a rating and comment. 
const myList= new mongoose.Schema({
  username: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: mongoose.Schema.name, ref:'Cafe'},
  location: {type: mongoose.Schema.location, ref:'Cafe'},
  myRating: Number,
  myComment: String
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below


