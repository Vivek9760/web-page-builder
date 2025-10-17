const crypto = require('crypto');
const WebPageModel = require('../models/web-page.model');

const generateRandomString = (length = 16) => {
    return crypto.randomBytes(length).toString('hex');
}

const generateOtp = (length = 6) => {
    return crypto.randomInt(0, 10 ** length).toString().padStart(length, '0');
}

const generateUniqueSlug = async (title) => {
  const baseSlug = title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");

  let slug = baseSlug;
  let exists = await WebPageModel.findOne({ slug });

  while (exists) {
    const randomSuffix = crypto.randomBytes(2).toString("hex");
    slug = `${baseSlug}-${randomSuffix}`;
    exists = await WebPageModel.findOne({ slug });
  }

  return slug;
};

module.exports = {
  generateOtp,
  generateRandomString,
  generateUniqueSlug,
};