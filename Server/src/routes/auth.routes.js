const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.schema');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', authenticate, profile);

module.exports = router;
