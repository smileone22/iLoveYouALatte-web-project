const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

//use mongoose.model to bring in your constructors


//use mongoose.model to bring in your constructors
//do not require your db.js file; instead, bring in only mongoose

/*
no return value - calls callback functions, errorCallback or successCallback
*/
function register(username, email, password, errorCallback, successCallback) {
  // console.log(username);
  // console.log(email);
  // console.log(password);
  // console.log(typeof(username));
  if (username.length < 8 || password.length < 8 ){
    console.log('USERNAME PASSWORD TOO SHORT');
    errorCallback( {message: 'USERNAME PASSWORD TOO SHORT'});
  }
  else {
    User.findOne({'username':username},(err, result, count) => { 
    if (result){ //check if the length of the resulting Array is greater than 0
      const errObj = {message: 'USERNAME ALREADY EXISTS'}; 
      console.log(errObj.message);
      errorCallback(errObj);
    }
    else{ //create a new user 
      bcrypt.hash(password, 10, function(err, hash) {//salt and hash the password
        if (err){
          const error={message: 'PASSWORD ERROR'};
          console.log(error.message);
          errorCallback(error);
        }
        else{
          const newUser= new User({
              username: username,
              email: email,
              password: hash
          });
          newUser.save(function(err, result,count){
          if (err){
            const error={message:'DOCUMENT SAVE ERROR'};
            console.log(error.message);
            errorCallback(error);
          }
          else {
            successCallback(result);
          }
          })
        }  
    });
    }
  })
  }
};
//no return value
//calls callback functions, errorCallback or successCallback
function login(username, password, errorCallback, successCallback) {
  User.findOne({username: username}, (err, user, count) => {

    if (!err && user) { //no error and user exists
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        // regenerate session if passwordMatch is true
        if (passwordMatch){
          successCallback(user);
        }
        else{
          const error = {message:'PASSWORDS DO NOT MATCH'};
          console.log(error.message);
          errorCallback(error);
        }
   });}
   else if(!user){
     const error={message:'USER NOT FOUND'};
     console.log(error.message);
     errorCallback(error);
   }
  });
}   


/*
- no return value (instead, calls callback function)
- regenerate a session id by using req.session.regenerate 
- add the user object passed in to the session
*/
function startAuthenticatedSession(req, user, cb) {
//check if someone is logged in by looking at the user object in req.session
  req.session.regenerate((err) => {
    if (!err) {
      req.session.username = user; 
      cb();
    } else {
      console.log(err);
      cb(err);
    }
  });
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};


