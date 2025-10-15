const crypto = require('crypto');

const generateRandomString = (length = 16) => {
    return crypto.randomBytes(length).toString('hex');
}

const generateOtp = (length = 6) => {
    return crypto.randomInt(0, 10 ** length).toString().padStart(length, '0');
}

module.exports = {
    generateOtp,
    generateRandomString
}