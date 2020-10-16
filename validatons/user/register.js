const User = require("../../models/User");
const Validation = require("../Validation");

class Register extends Validation {

  validate(options) {

    const rules = [
      super.body('name').trim().not().isEmpty(),
      super.body('email').trim().not().isEmpty().isEmail().custom(email => {
        return User.findOne({email}).then(user => {
          if (user) return Promise.reject('E-mail already in use');
        });
      }),
      super.body('password').isLength({min: 5}).custom((value, {req}) => {
        if (value !== req.body.password2) throw new Error('Password confirmation does not match password');

        return true;
      }),
      super.body('password2').isLength({min: 5})
    ];

    return super.validate(rules, options);
  }

}

const register = new Register();

module.exports = register;