const {body, validationResult} = require('express-validator');

module.exports = class Validation {

  body(field) {
    return body(field);
  }

  validate(rules, options) {
    return [...rules, this.nextRoute(options)];
  }

  nextRoute(options) {
    return (req, res, next) => {
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
    };
  }
  
};