module.exports = class Avci {
  static format(err, req, res, next) {
    req.avciErrors = err.array();
    next();
  }
};