const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

router.use('/', require('./swagger'));

router.use('/users', require('./users'));

router.use('/events', require('./events'));

const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
    console.log("Login route hit with data:", req.body); // Add logging to confirm
    next();
}, passport.authenticate('local', { failureFlash: false }), (req, res) => {
    const token = generateToken(req.user);
    console.log("User after login:", req.user); // Logging user object

    const responseData = {
        userId: req.user._id.toString(),
        username: req.user.username,
        favorites: req.user.favorites,
        dislikes: req.user.dislikes,
        token: token // Include the JWT token in the response
    };
    res.json({ message: 'Logged in successfully', user: responseData });
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
