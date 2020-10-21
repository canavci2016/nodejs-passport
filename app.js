const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const RouteLoaders = require("./loaders/Route");

const app = express();
const PORT = process.env.PORT || 5000;

// Passport initialize
require("./config/passport")(passport);


// DB config -  Connect to Mongo
const db = require("./config/keys").MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true}).catch((e => console.log(e)));


// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");  //default directory for view engines


//Express Session
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variable
app.use((req, res, next) => {

  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  next();
});


//Body Parser
app.use(express.urlencoded({extended: true}));


// STATIC DIRECTORY
app.use(express.static('public'));
app.use('/static', express.static('public'));


// ROUTES
new RouteLoaders(app);
app.use('/', require('./routes/index')); //index of routes
app.use('/users', require('./routes/users')); //index of routes


app.resource('/ccs', require('./controllers/TestResourceController')); //index of routes


app.get('/readFile/:user', function (req, res, next) {
  res.message("wad");

  Promise.resolve().then(function () {
    throw new Error('BROKEN');
  }).catch(next); // Errors will be passed to Express.
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send('Hata oluştu');
  // logic
});

app.listen(PORT, console.log(`Server started on ${PORT}`));