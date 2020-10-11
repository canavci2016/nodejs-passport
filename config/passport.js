const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({usernameField: "email"}, (email, password, done) => {
      User.findOne({email})
        .then((user) => {
          if (!user) {
            return done(null, false, {message: "that email is not registered"});
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) done(err);
            return isMatch ? done(null, user) : done(null, false, {message: "password is incorrect"});
          });
        });
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

};






