const express = require('express');
const connectDB = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const { User } = require('./models/users');
const bcrypt = require('bcryptjs');

const app = express();

const port = process.env.port || 3000;

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true })) // Add this line

    .use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize())
    .use(passport.session())

    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, 2-key'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })

    .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'], origin: '*' }))

    .use('/', require('./routes'));

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect Username' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect Password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.send(`Logged in as ${req.session.user.username}`);
    } else {
        res.send('Logged Out');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}), 
(req, res) => {
    console.log('User:', req.user);
    req.session.user = req.user;
    console.log('Session after setting user:', req.session);
    res.redirect('/');
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught Exception: ${err}\nException Origin: ${origin}`);
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});
