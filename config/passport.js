const LocalStrategy = require("passport-local").Strategy;
const UserServiceClass = require("../services/User");
const UserService = new UserServiceClass();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({usernameField: "email"}, (email, password, done) => {
      UserService.findByCrypte(email, password).then(user => done(null, user)).catch(err => done(null, false, err));
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => UserService.findById(id, (err, user) => done(err, user)));

};






