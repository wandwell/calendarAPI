const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.use('/users', require('./users'));

router.use('/events', require('./events'));

router.post('/login', (req, res, next) => {
    console.log("Login route hit with data:", req.body); // Add logging to confirm
    next();
}, passport.authenticate('local', { failureFlash: false }), (req, res) => {
    req.session.user = req.user;
    console.log("User after login:", req.user); // Logging user object
    console.log("Session after login:", req.session); // Logging session
    req.session.save((err) => { // Ensure session is saved
        if (err) {
            console.error("Error saving session:", err);
            return next(err);
        }
        const responseData = {
            userId: req.user._id.toString(),
            username: req.user.username,
            favorites: req.user.favorites,
            dislikes: req.user.dislikes
        };
        res.json({ message: 'Logged in successfully', user: responseData });
    });
});

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
