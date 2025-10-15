const { Router } = require("express");
const router = Router();
const { authentication, permitRole } = require("../middlewares/authentication.middleware");

/* ----------------------------- authentication routes ----------------------------- */
router.use("/authentication", require("./authentication.route"));

/* ----------------------------- user routes ----------------------------- */
// router.use('/user', authentication, permitRole('CLIENT'), require('./user'));

/* ----------------------------- admin routes ----------------------------- */
router.use("/admin", authentication, permitRole("ADMIN"), require("./admin.route.js"));

module.exports = router;
