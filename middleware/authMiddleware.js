const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.error("Token not found");
        return res.status(401).json('You do not have access');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.status(403).json('Invalid token');
        }
        req.user = user;
        console.log('req.user:' + req.user);
        next();
    });
};

const isUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = req.user;

    if (user.userId !== userId) {
        return res.status(403).json('Forbidden: You can only access your own data');
    }

    next();
};

module.exports = {
    authenticateToken,
    isUser
};
