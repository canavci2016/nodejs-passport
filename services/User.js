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

  async findByCrypte(email, password) {
    const user = await UserModel.findOne({email});
    if (!user) throw new Error("that email is not registered");

    let crypt = await bcrypt.compare(password, user.password);
    if (!crypt) throw new Error("password is incorrect");

    return user;
  }

  findById(id, callback) {
    return UserModel.findById(id, callback);
  }

};