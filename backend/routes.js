// routes.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes'); // Import your user-related routes

router.use('/', userRoutes); 
module.exports = router;
