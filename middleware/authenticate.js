const { User } = require('../models/users');

const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json('You do not have access');
    }
    next();
};

const isUser = async (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json('You do not have access');
    }

    const userId = req.params.id;
    const user = req.session.user;

    if (user._id !== userId) {
        return res.status(403).json('Forbidden: You can only access your own data');
    }

    next();
};

module.exports = {
    isAuthenticated,
    isUser
};
