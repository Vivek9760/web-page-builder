const { Router } = require("express");
const router = Router();
const { authentication } = require("../middlewares/authentication.middleware");

/* ----------------------------- authentication routes ----------------------------- */
router.use("/authentication", require("./authentication.route"));

/* ----------------------------- user routes ----------------------------- */
// router.use('/user', authentication, require('./user'));

/* ----------------------------- admin routes ----------------------------- */
// router.use("/admin", authentication, require("./admin"));

module.exports = router;