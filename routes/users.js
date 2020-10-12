var express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var passport = require("passport");
var registerValidation = require("../validatons/user/register");


// user model
const User = require("../models/User");


router.get('/login', (req, res) => res.render('login'));


router.route('/register')
  .get((req, res) => res.render('register'))
  .post(registerValidation({json: false}), (req, res) => {

    const {name, email, password, password2} = req.body;

    let errors = (req.avciErrors || []).map(err => ({msg: err.param + ' ' + err.msg}));

    if (errors.length > 0) {
      return res.render('register', {errors, name, email, password, password2});
    }


    User.findOne({email}).then(user => {
      if (user) {
        errors.push({msg: "Email is already registered"});
        res.render('register', {errors, name, email, password, password2});
      } else {
        const newUser = new User({name, email, password});
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(() => {
              req.flash("success_msg", "You are now registered and can log in");
              res.redirect('/users/login');
            })
            .catch((error) => console.log(error));
        }));
      }

    });

  });


router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    successFlash: 'Welcome!',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  (req, res, next) => {
    res.send("ddd");
    console.log(req.user);

  });

router.get('/logout', (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect('/users/login');
});


module.exports = router;