/* ----------------------------- libraries ----------------------------- */
const mongoose = require('mongoose');

/* ----------------------------- schema ----------------------------- */
const WebPageSchema = require('../schemas/web-page.schema')(mongoose);

const WebPageModel = mongoose.model('web-page', WebPageSchema);

module.exports = WebPageModel;