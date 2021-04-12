require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const auth = require('./auth.js');
const { isError } = require('util');

const app = express();

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, "views"));
//app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/list', (req, res) => {
  res.render('index');
});

app.get('/list/:slug', (req, res) => {
  res.render('list-detail');
});

app.get('/list/add', (req, res) => {
  res.render('list-add');
});

app.get('/:username', (req, res) => {
  res.render('mylist');
});


app.listen(3000);
