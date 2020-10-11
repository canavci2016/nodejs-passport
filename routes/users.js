var express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var passport = require("passport");


// user model
const User = require("../models/User");


router.get('/login', (req, res) => res.render('login'));


router.route('/register')
  .all((req, res, next) => next())   // runs for all HTTP verbs, first think of it as route specific middleware!
  .get((req, res) => res.render('register'))
  .post((req, res) => {
    const {name, email, password, password2} = req.body;

    let errors = [];
    if (!name || !email || !password || !password2) {
      errors.push({msg: "please fill in all fields"});
    }

    if (password !== password2) {
      errors.push({msg: "passwords do not match"});
    }

    if (password.length < 6) {
      errors.push({msg: "passwords should be at least six characters"});
    }

    if (errors.length > 0) {
      res.render('register', {errors, name, email, password, password2});
    } else {
      User.findOne({email}).then(user => {
        if (user) {          //User exists
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
    }

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