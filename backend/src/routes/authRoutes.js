const express = require('express');
const AuthController = require('../controllers/authController');
const { loginValidation } = require('../validators/authValidator');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginValidation, validate, AuthController.login);

// POST /api/auth/register
router.post('/register', require('../validators/authValidator').registerValidation, validate, AuthController.register);

module.exports = router;
