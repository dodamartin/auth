// userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('./controllers/UserController'); // Import user controller

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/generate-otp', UserController.generateOTP);
router.post('/verify-otp', UserController.verifyOTP);

module.exports = router;
