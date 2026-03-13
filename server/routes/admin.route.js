/* ----------------------------- libraries ----------------------------- */
const { Router } = require('express');
const router = Router();

/* ----------------------------- controller ----------------------------- */
const UsersController = require('../controllers/admin/dassers.controller');


router.get('/users', UsersController.getUsersList);


module.exports = router;