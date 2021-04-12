const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

//use mongoose.model to bring in your constructors


function register(username, email, password, errorCallback, successCallback) {
 
}



function login(username, password, errorCallback, successCallback) {


}

function startAuthenticatedSession(req, user, cb) {


}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};