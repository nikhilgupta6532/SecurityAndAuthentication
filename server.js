const express = require('express');
const {mongoose} = require('./db/mongoose');
const bodyParser = require('body-parser');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/users',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
});


app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user);
});

app.listen(3000,()=>{
  console.log('server is up on port 3000');
});
