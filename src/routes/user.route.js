const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authenticate");
const userController = require('../controllers/user.controller');

router.post('/logout', authMiddleware, userController.logout);
router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);

module.exports = router
