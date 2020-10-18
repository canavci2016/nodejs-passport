var express = require("express");
const router = express.Router();
var passport = require("passport");
var registerValidation = require("../validatons/user/register");
var ValidationExceptionCLass = require("../validatons/error/Avci");
let UserController = require("../controllers/UserController");

let UserControllerInstance = new UserController();


router.get('/login', (req, res) => res.render('login'));


router.route('/register')
  .get(UserControllerInstance.getRegister)
  .post(registerValidation.validate(ValidationExceptionCLass), UserControllerInstance.postRegister);


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