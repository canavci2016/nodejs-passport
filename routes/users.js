var express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var passport = require("passport");
var registerValidation = require("../validatons/user/register");
var ValidationExceptionCLass = require("../validatons/error/Avci");


// user model
const User = require("../models/User");


router.get('/login', (req, res) => res.render('login'));


router.route('/register')
  .get((req, res) => res.render('register'))
  .post(registerValidation.validate(ValidationExceptionCLass), (req, res) => {

    const {name, email, password, password2} = req.body;

    let errors = (req.avciErrors || []).map(err => ({msg: err.param + ' ' + err.msg}));

    if (errors.length > 0) {
      return res.render('register', {errors, name, email, password, password2});
    }

    const newUser = new User({name, email, password});

    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;

      (async function () {
        try {
          newUser.password = hash;
          await newUser.save();
          req.flash("success_msg", "You are now registered and can log in");
          res.redirect('/users/login');
        } catch (e) {
          req.flash("error_msg", "Hata oluştu :" + e.message);
          res.redirect('/users/register');
        }
      })();

    }));

  });


router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    successFlash: 'Welcome!',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect('/users/login');
});


module.exports = router;