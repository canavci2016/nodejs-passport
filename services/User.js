let bcrypt = require("bcryptjs");
const UserModel = require("../models/User");// user model

module.exports = class User {

  createWithCrypted(name, email, password) {

    return new Promise((resolve, reject) => {

      bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, (err, hash) => {

        if (err) {
          return reject(err);
        }

        this.create(name, email, hash).then((val) => resolve(1)).catch(e => reject(e));

      }));

    });
  }

  create(name, email, password) {
    return new UserModel({name, email, password}).save();
  }

};