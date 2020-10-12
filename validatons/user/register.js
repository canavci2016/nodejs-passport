const {body, validationResult} = require('express-validator');
const User = require("../../models/User");

module.exports = function (options) {

  const validations = [
    body('name').trim().not().isEmpty(),
    body('email').trim().not().isEmpty().isEmail()
      .custom(email => {
        return User.findOne({email}).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }),
    body('password').isLength({min: 5}).custom((value, {req}) => {
      if (value !== req.body.password2) throw new Error('Password confirmation does not match password');

      return true;
    }),
    body('password2').isLength({min: 5})
  ];

  return [
    ...validations,
    function (req, res, next) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (typeof options != 'undefined') {
          const {json} = options;
          if (json) {
            return res.status(400).json({errors: errors.array()});
          }
        }
      }

      req.avciErrors = errors.array();

      next();
    }
  ];

};