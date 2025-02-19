const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

router.use('/users', require('./users'));
router.use('/events', require('./events'));

const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
    console.log("Login route hit with data:", req.body);
    next();
}, passport.authenticate('local', { session: false, failureFlash: false }), (req, res) => { // Set session to false
    const token = generateToken(req.user);
    console.log("User after login:", req.user);

    const responseData = {
        userId: req.user._id.toString(),
        username: req.user.username,
        favorites: req.user.favorites,
        dislikes: req.user.dislikes,
        token: token // Include the JWT token in the response
    };
    res.json({ message: 'Logged in successfully', user: responseData });
});

// Add error handling middleware
router.use((err, req, res, next) => {
    console.error("Error handling middleware:", err.stack);
    res.status(500).json({ message: 'An internal server error occurred' });
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
