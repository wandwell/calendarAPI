const express = require('express');
const connectDB = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const { User } = require('./models/users');
const bcrypt = require('bcryptjs');
const MongoStore = require('connect-mongo');

const app = express();

const port = process.env.port || 3000;

const corsOptions = {
    origin: 'https://ontheplate.netlify.app', // Update to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow credentials
}

app
    .use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true })) // Add this line

    .use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        }),
        cookie: { secure: true, httpOnly: true, sameSite: 'None' }
    }))
    .use(passport.initialize())
    .use(passport.session())

    .use((req, res, next) => {
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
        next();
    })
    app.use((req, res, next) => {
        console.log("Incoming request:", req.method, req.url);
        console.log("Request headers:", req.headers);
        console.log("Session data:", req.session);
        next();
    });
    
    app.use((req, res, next) => {
        res.on('finish', () => {
            console.log('Outgoing response headers:', res.getHeaders());
        });
        next();
    });

    app.disable('x-powered-by');
    
    app.use('/', require('./routes'));

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

app.post('/login', passport.authenticate('local', { failureFlash: false }), (req, res) => {
    req.session.user = req.user;
    console.log("User after login:", req.user); // Logging user object
    console.log("Session after login:", req.session); // Logging session

    const responseData = {
        userId: req.user._id.toString(),
        username: req.user.username,
        favorites: req.user.favorites,
        dislikes: req.user.dislikes
    };

    res.json({ message: 'Logged in successfully', user: responseData });
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
