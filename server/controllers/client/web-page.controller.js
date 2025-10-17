/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = "server/controllers/client/web-page.controller";

/* ----------------------------- model ----------------------------- */
const WebPageModel = require("../../models/web-page.model");

/* ----------------------------- constants ----------------------------- */
const TOASTY = require("../../constants/toasty.constant");
const HTTP_STATUS = require("../../constants/http-status.constant");

/* ----------------------------- utils ----------------------------- */
const { generateUniqueSlug } = require("../../utils/crypto.util");

/* ----------------------------- getWebPageList ----------------------------- */
const getWebPageList = async (req, res) => {
  try {
    const { userId } = req;

    const webPages = await WebPageModel.find({ author: userId }, { title: 1, slug: 1, status: 1, createdOn: 1 }).sort({ createdOn: -1 });

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

/* ----------------------------- saveOrPublishWebPage ----------------------------- */
const saveOrPublishWebPage = async (req, res) => {
  try {
    const { userId, params, body } = req;
    const { status } = params;
    const { title, blocks, slug } = body;

    if (!["draft", "published"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid status" });
    }

    let webPage = await WebPageModel.findOne({ author: userId, slug });

    if (webPage) {
      webPage.title = title || webPage.title;
      webPage.blocks = blocks || webPage.blocks;
      webPage.status = status;
      await webPage.save();
    } else {
      const slug = await generateUniqueSlug(title || "Web Page");
      webPage = await WebPageModel.create({
        title,
        slug,
        author: userId,
        blocks,
        status,
      });
    }

    return res.status(HTTP_STATUS.OK).json({ message: status == "draft" ? TOASTY.WEB_PAGE.SAVED : TOASTY.WEB_PAGE.PUBLISHED, slug: webPage.slug });
  } catch (error) {
    console.error("saveOrPublishWebPage ->", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  getWebPageList,
  getWebPageBySlug,
  saveOrPublishWebPage,
};
