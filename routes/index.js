const passport = require('passport');
const router = require('express').Router();

router.use('/', require('./swagger'));

router.use('/users', require('./users'));

router.use('/events', require('./events'));

router.post('/login', (req, res, next) => {
    //#swaggertags=['login']
    const { username, password } = req.body; // Accepting username and password from the request body
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' }); // Provide a clear response for failure
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.user = user;

            // Prepare JSON response
            const responseData = {
                userId: user._id.toString(),
                username: user.username,
                favorites: user.favorites,
                dislikes: user.dislikes
            };

            return res.json({ message: 'Logged in successfully', user: responseData }); // Return JSON response instead of redirecting
        });
    })(req, res, next);
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
