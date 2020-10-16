const {body, validationResult} = require('express-validator');
const AvciError = require("./error/Avci");

module.exports = class Validation {

  body(field) {
    return body(field);
  }

  validate(rules, exceptionClassName) {
    return [...rules, this.nextRoute(exceptionClassName)];
  }

  nextRoute(exceptionClassName = AvciError) {
    return (req, res, next) => {
      const errors = validationResult(req);
      return !errors.isEmpty() ? exceptionClassName.format(errors, req, res, next) : next();
    };
  }

};