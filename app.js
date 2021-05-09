const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth');
const { isError } = require('util');

const app = express();
const passport = require('passport');
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
const sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());


const Cafe = mongoose.model('Cafe');
const User = mongoose.model('User');
const myList = mongoose.model('myList');

// add req.session.user to every context object for templates
app.use((req, res, next) => {
  // now you can use {{user}} in your template!
  res.locals.user = req.session.user;
  next();
});


app.get('/', (req, res) => {
  res.render('home');
});

app.post('/list',(req,res) => {
  if (req.session.user===undefined){
    const loginState= false; 
    const message= 'You need to login in order to add cafes to your page';
    Cafe.find({}, function(error, result, count) {
      res.render('list',{cafes: result, message:message, login:false});
    });
  }
  else{
    const slugg= req.body.add;
    const newMy= new myList({
      username: req.session.user.username,
      cafename: slugg,
      url: 'http://linserv1.cims.nyu.edu:10630/list/'+slugg,
      myRating:0,
      myComments:''
    });
    console.log(newMy);
    newMy.save(function(err, result,count){
      if (err!==null){ 
          console.log(result);
          console.log('Cafe to my list SAVE ERROR');
      }
      else { //success 
          console.log(result);
          res.redirect('/list');
      }
      });
  }
});





app.get('/list', (req, res) => {
  console.log(req.query.Name);
  const keyword=req.query.Name;
  let message;
  let state= true;
  if (req.session.user===undefined){
    state=false;
  }
  if(req.query.Name===undefined ||req.query.Name===''){
    message='You did not enter a keyword. Here are all cafes';
    Cafe.find({}, function(error, result, count) {
      res.render('list',{cafes: result, message:message, loginState:state});
    });
  }
  else{
    message='Cafes you might have searched for...';
    Cafe.find({ $or :[{name:new RegExp(keyword, 'i')},{location:new RegExp(keyword,'i')} ]},function(error,result, count){
      res.render('list',{cafes: result,message:message, loginState:state});
    });
  }
});

//db.caves.find({ $or :[{name:/.*camel.*/i},{location:/.*Seoul.*/i}  ]})

app.get('/list/add', (req, res) => {
  if(req.session.user===undefined){//not logged in
      res.redirect('/login');
  }
  else{
      res.render('list-add');
  }
});

app.post('/list/add', (req, res) => {
  if(req.session.user===undefined){//not logged in
      res.redirect('/login');
  }
  else{
      const newCafe= new Cafe({
        name: req.body.name,
        location: req.body.location,
        reviewurl: req.body.reviewurl,
        savedBy: req.session.user._id
      });
      newCafe.save(function(err, result,count){
      if (err!==null){ 
          console.log(result);
          console.log('NEW Cafe SAVE ERROR');
          res.render('list-add',{message:'NEW Cafe SAVE ERROR'});
      }
      else { //success 
          console.log(result);
          res.redirect('/list');
      }
      });
  }

});


app.get('/list/:slug', (req, res) => {
  const details= req.params.slug;
  Cafe.findOne({slug: details},(err, cafe,count)=>{
      User.findOne({_id: cafe.savedBy},(err,user,count)=> {
          res.render('list-detail',{cafe:cafe, user:user});
      } );
  } )
});


//display the form 
app.get('/register', (req, res) => {
  res.render('register');
});

//process the form input
// app.post('/register', (req, res) => {
//   const input=req.body;
//   console.log(input);
//   auth.register(input.username, input.email, input.password, 
//       (error) =>{ //error cb
//       res.render('register',{message:error.message});
//   },
//       (user)=>{ //success callback
//           auth.startAuthenticatedSession(req,user, (obj) =>{
//               console.log(obj);
//               res.redirect('/list');
//           });
//       });
// });

app.post('/register', function(req, res) {
  User.register(new User({username:req.body.username , email:req.body.email, password:req.body.password}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});
app.get('/login', (req, res) => {
  res.render('login');
});



// app.post('/login', (req, res) => {
//   auth.login(req.body.username, req.body.password, 
//       (error)=>{//error cb
//           res.render('login',{message:error.message});
//   }, 
//       (user)=>{//success cb
//           auth.startAuthenticatedSession(req,user,(obj)=>{
//               req.session.user=user;
//               res.redirect('/');
            
//           });
//   }
  
//   );
// });
app.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

app.get('/mypage', (req, res) => {
  if(req.session.user===undefined){//not logged in
    res.redirect('/login');
  }
  else{
    const cur=req.session.user.username;
    myList.find({username:cur},function(err,result,count) {
      console.log('this is c lst', result);
      res.render('mypage', {username:cur,  clist:result});
    });
  }
});

app.get('/mypage-add' , (req, res) => {
  console.log(req.params);
  if (req.query.write!==undefined) { 
    const cafeN= req.query.write;
    res.render('mypage-add',{h:cafeN});
  }
  if (req.query.read!==undefined){
    console.log('need to start reading~~~~~');
    console.log(req.query.read);
    const cafename= req.query.read;
    myList.find({cafename: cafename},  function(err,result,count) {
      console.log(result[0]);
      const d= result[0]['myComment'];
      const r= '⭐'.repeat(result[0]['myRating']);
    
      const t= result[0]['cafename'];
      res.render('mypage-detail',{t:t, d:d, r:r});
    });
  }
});

//get response from mypage-add.hbs
app.post('/mypage', (req, res) => {
  if (req.body.review!==undefined){
    const filter = {username:req.session.user.username ,cafename:req.body.review};
    const update = {
         "myRating": req.body.star,
         "myComment":req.body.diary
   };
   var options = {
    setDefaultsOnInsert: true,
    useFindAndModify : true
  };

  myList.
  findOneAndUpdate(filter, update, options, function (error, doc) {
    console.log(error);
  })
  console.log('successfully updated myList');
  res.redirect('/mypage');
  }
  
});

module.exports=app;
app.listen(process.env.PORT || 3000);
