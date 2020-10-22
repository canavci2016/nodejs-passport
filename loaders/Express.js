const express = require("express");

module.exports = class Express {
  app = express();

  constructor() {
    console.log(this.app);
  }
};
