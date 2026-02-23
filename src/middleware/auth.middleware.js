const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, token is missing' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;

        return next();

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { authMiddleware };