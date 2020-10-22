module.exports = class Json {
  static format(err, req, res, next) {
    return res.status(400).json({errors: err.array()});
  }
};