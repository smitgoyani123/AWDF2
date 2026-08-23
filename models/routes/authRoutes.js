const express = require('express');
const { register, login } = require('../controllers/authController');
const {
	validateJsonContentType,
	validateRegisterInput,
	validateLoginInput
} = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/register', validateJsonContentType, validateRegisterInput, register);
router.post('/login', validateJsonContentType, validateLoginInput, login);

module.exports = router;
