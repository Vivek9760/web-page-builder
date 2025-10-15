/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = "server/controllers/client/web-page.controller";

/* ----------------------------- model ----------------------------- */
const WebPageModel = require("../../models/web-page.model");

/* ----------------------------- constants ----------------------------- */
const TOASTY = require("../../constants/toasty.constant");
const HTTP_STATUS = require("../../constants/http-status.constant");

/* ----------------------------- getWebPageList ----------------------------- */
const getWebPageList = async (req, res) => {
  try {
    const { userId } = req;

    const webPages = await WebPageModel.find({ author: userId }, { title: 1, slug: 1, status: 1, createdOn: 1 });

    return res.status(HTTP_STATUS.OK).json({ webPages });
  } catch (error) {
    console.error(FILE_PATH + "-> getWebPageList", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

/* ----------------------------- getWebPageBySlug ----------------------------- */
const getWebPageBySlug = async (req, res) => {
  try {
    const { userId, params } = req;
    const { slug } = params;

    const webPage = await WebPageModel.findOne({ author: userId, slug });

    return res.status(HTTP_STATUS.OK).json({ webPage });
  } catch (error) {
    console.error(FILE_PATH + "-> getWebPageBySlug", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  getWebPageList,
  getWebPageBySlug,
};
