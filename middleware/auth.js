module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.user) {
      return next();
    }
    req.flash("error_msg", "Please log into view this resource");
    res.redirect("/users/login");
  }
};