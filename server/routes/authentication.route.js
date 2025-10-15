/* ----------------------------- libraries ----------------------------- */
const { Router } = require('express');
const router = Router();

/* ----------------------------- middleware ----------------------------- */
const { authentication } = require('../middlewares/authentication.middleware');

/* ----------------------------- controller ----------------------------- */
const AuthenticationController = require('../controllers/authentication.controller');


router.post('/login', AuthenticationController.login);
router.get('/user-session', authentication, AuthenticationController.loginSession);
router.post('/signup', AuthenticationController.signup);
router.post('/verify-email', AuthenticationController.verifyEmail);
router.post("/send-otp/verify-email", AuthenticationController.sendOtp);
router.post('/logout', authentication, AuthenticationController.logout);


module.exports = router;