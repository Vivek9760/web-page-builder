/* ----------------------------- libraries ----------------------------- */
const { Router } = require('express');
const router = Router();

/* ----------------------------- controller ----------------------------- */
const UsersController = require('../controllers/admin/Users.controller');


router.get('/users', UsersController.getUsersList);


module.exports = router;