const express = require('express');
const connectDB = require('./data/database');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const { User } = require('./models/users');
const bcrypt = require('bcryptjs');

const app = express();

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'https://ontheplate.netlify.app', // Update to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow credentials
};

const JWT_SECRET = 'your_jwt_secret_key';

app
    .use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true })) // Add this line

    .use((req, res, next) => {
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
        next();
    })
    .use((req, res, next) => {
        console.log("Incoming request:", req.method, req.url);
        console.log("Request headers:", req.headers);
        next();
    })
    .use((req, res, next) => {
        res.on('finish', () => {
            console.log('Outgoing response headers:', res.getHeaders());
        });
        next();
    });

app.disable('x-powered-by');

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

const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/login', passport.authenticate('local', { failureFlash: false }), (req, res) => {
    const token = generateToken(req.user);
    const responseData = {
        userId: req.user._id.toString(),
        username: req.user.username,
        favorites: req.user.favorites,
        dislikes: req.user.dislikes,
        token: token
    };

    res.json({ message: 'Logged in successfully', user: responseData });
});

app.get('/events', authenticateToken, (req, res) => {
    // Example protected route
    Event.find({ userId: req.user.userId }, (err, events) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(events);
    });
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
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
