// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

// Users
// * our site requires authentication.
// * so users have a username and password
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},// username 
  email: {type: String, unique: true, required: true},
  password: {type: String, unique: true, required: true}, // password hash 
});

UserSchema.plugin(passportLocalMongoose);

// a Cafe
// * includes name, location, reviewurl, and a list of user information who saved the cafe.
const CafeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  location: {type: String, required: true},
  reviewurl: String,
  savedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});



// My cafe List
// This is a list of cafes that the user saved or registerd. 
// * each list must have a related user.
// * each list may have a rating and comment. 
const myListSchema= new mongoose.Schema({
  username: {type: String, ref:'User'},
  cafename: {type: String, ref:'Cafe'},
  url: String,
  myRating:  {type: Number, default:0},
  myComment: {type: String, default:'Not written yet'}
});
CafeSchema.plugin(URLSlugs('name'));


mongoose.model('User', UserSchema);
mongoose.model('Cafe', CafeSchema);
mongoose.model('myList', myListSchema);



// TODO: add remainder of setup for slugs, connection, registering models, etc. below
// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);


 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
//dbconf = 'mongodb://hk2874:cUCtoLL8@class-mongodb.cims.nyu.edu/hk2874';

dbconf='mongodb://localhost/finalprojectconfig';
}


 mongoose.connect(dbconf,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});
//mongoose.connect('mongodb://localhost/finalprojectconfig',{ useUnifiedTopology: true });
// mongoose.connect('mongodb://hk2874:cUCtoLL8@class-mongodb.cims.nyu.edu/hk2874',
// {useNewUrlParser: true, useUnifiedTopology: true});

