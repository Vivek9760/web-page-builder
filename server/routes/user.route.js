/* ----------------------------- libraries ----------------------------- */
const { Router } = require('express');
const router = Router();

/* ----------------------------- controller ----------------------------- */
const WebPageController = require('../controllers/client/web-page.controller.js');


router.get("/web-pages", WebPageController.getWebPageList);
router.get("/web-page/:slug", WebPageController.getWebPageBySlug);
router.post("/web-page/:status", WebPageController.saveOrPublishWebPage);


module.exports = router;