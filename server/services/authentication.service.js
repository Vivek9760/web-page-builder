/* ----------------------------- libraries ----------------------------- */
const JWT = require('jsonwebtoken');

/* ----------------------------- models ----------------------------- */
const AuthenticationModel = require('../models/authentication.model');

/* ----------------------------- utils ----------------------------- */
const { generateRandomString } = require('../utils/crypto.util');

/* ----------------------------- constants ----------------------------- */
const { SESSION_EXPIRY } = require('../constants/authentication.constant');


const createUserStore = async (user) => {
    const sessionId = generateRandomString();
    const sessionObj = {
        sessionId, userId: user._id
    }
    /* ----------------------------- session token expires in 1 month ----------------------------- */
    const sessionToken = JWT.sign(sessionObj, process.env.SECRET_KEY, { expiresIn: '30d' });

    await AuthenticationModel.create({
        sessionId,
        userId: user._id,
        expiredAt: new Date(Date.now() + SESSION_EXPIRY),
    });

    return {
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
        sessionToken
    }
}

module.exports = {
    createUserStore
}