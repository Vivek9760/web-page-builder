const SALT_ROUND = 10;

/* ----------------------------- if user in-active ----------------------------- */
const SESSION_EXPIRY = 12 * 60 * 60 * 100; // 12 hours

/* ----------------------------- token expiry ----------------------------- */
const TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes


module.exports = {
    SALT_ROUND,
    SESSION_EXPIRY,
    TOKEN_EXPIRY
}