/* ----------------------------- libraries ----------------------------- */
const { Router } = require('express');
const router = Router();

/* ----------------------------- controller ----------------------------- */
const UsersController = require('../controllers/admin/users.controller');


router.get('/users', UsersController.getUsersList);


module.exports = router;