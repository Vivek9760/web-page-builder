/* ----------------------------- libraries ----------------------------- */
const mongoose = require('mongoose');

/* ----------------------------- schema ----------------------------- */
const UserSchema = require('../schemas/user.schema')(mongoose);

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;