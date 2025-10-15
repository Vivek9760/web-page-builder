/* ----------------------------- libraries ----------------------------- */
const mongoose = require('mongoose');

/* ----------------------------- schema ----------------------------- */
const AuthenticationSchema = require('../schemas/authentication.schema')(mongoose);

const AuthenticationModel = mongoose.model('authentication', AuthenticationSchema);

module.exports = AuthenticationModel;
