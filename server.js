const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const RouteLoaders = require("./loaders/Route");
const { local: localStrategy } = require("./config/passport").strategies;

class Server {
    app;

    constructor(app) {
        this.app = app;
        this.db();
        this.middleware();
        this.routes();
        this.exceptionHandler();
    }

    db() {
        const db = require("./config/keys").MongoURI;
        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).catch((e => console.log(e)));
    }

    middleware() {
        // EJS
        this.app.use(expressLayouts);
        this.app.set("view engine", "ejs");

        //Express Session
        this.app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

        // Passport initialize strategy
        localStrategy.func(passport);
        //Passport Middleware
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        //Connect Flash
        this.app.use(flash());

        //Global Variable
        this.app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error");
            res.locals.success = req.flash("success");
            next();
        });


        //Body Parser
        this.app.use(express.urlencoded({ extended: true }));
        // STATIC DIRECTORY
        this.app.use(express.static('public'));
        this.app.use('/static', express.static('public'));
        new RouteLoaders(this.app);
    }

    routes() {
        require("./routes/index")(this.app);
    }

    exceptionHandler() {
        this.app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.send('Hata oluştu');
            // logic
        });
    }
}

module.exports = Server;