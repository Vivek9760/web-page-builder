const { Router } = require("express");
const router = Router();

/* ----------------------------- middleware ----------------------------- */
const { authentication, permitRole } = require("../middlewares/authentication.middleware");

/* ----------------------------- controller ----------------------------- */
const WebPageController = require('../controllers/client/web-page.controller.js');


/* ----------------------------- authentication routes ----------------------------- */
router.use("/authentication", require("./authentication.route"));

/* ----------------------------- user routes ----------------------------- */
router.use('/user', authentication, permitRole('CLIENT'), require('./user.route.js'));

/* ----------------------------- admin routes ----------------------------- */
router.use("/admin", authentication, permitRole("ADMIN"), require("./admin.route.js"));

/* ----------------------------- published web page ----------------------------- */
router.get("/published/web-page/:slug", WebPageController.getPublishWebPageBySlug);
router.get("/published/web-pages", WebPageController.getPublishedWebPages);


module.exports = router;
