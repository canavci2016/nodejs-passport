const ensureAuthenticated = require("../middleware/auth").ensureAuthenticated;

module.exports = function (app) {

    app.get('/', (req, res) => res.render('welcome'));
    app.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', { user: req.user }));
    app.use('/users', require('./users'));
    app.resource('/ccs', require('../controllers/TestResourceController'), 'test'); //index of routes
    app.get('/readFile/:user', function (req, res, next) {
        Promise.resolve().then(function () {
            throw new Error('BROKEN');
        }).catch(next); // Errors will be passed to Express.
    });
}