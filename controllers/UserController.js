let UserService = require("../services/User");// user model

let UserServiceInstance = new UserService();

module.exports = class UserController {

  getRegister(req, res,) {
    res.render('register');
  }

  postRegister(req, res) {

    const {name, email, password, password2} = req.body;

    let errors = (req.avciErrors || []).map(err => ({msg: err.param + ' ' + err.msg}));

    if (errors.length > 0) {
      return res.render('register', {errors, name, email, password, password2});
    }

    UserServiceInstance.createWithCrypted(name, email, password).then(function (val) {
      req.flash("success_msg", "You are now registered and can log in");
      res.redirect('/users/login');
    }).catch((e) => {
      req.flash("error_msg", "Hata oluştu :" + e.message);
      res.redirect('/users/register');
    });
  }

};