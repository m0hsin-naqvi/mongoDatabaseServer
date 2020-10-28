let express = require('express');
let User = require('../models/user');
let passport = require('passport');
let authenticate = require('../authenticate');
const user = require('../models/user');
const bodyParser = require('body-parser');



let router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
  User.find({})
  .then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  console.log("Enter in Signup Function");
  console.log('Request Body',req.body);
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      console.log("First Name is: ", req.body.firstname);
      console.log("Last Name is: ", req.body.lastname);
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});


router.post('/login',passport.authenticate('local'),(req, res)=>{

  let token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({
    success: true, 
    token: token,
    status: 'You are successfully logged in!'
  })
})
module.exports = router;
