const express = require('express');
const { login, getAllUsers } = require('../controllers/authController');

const router = express.Router();

// Public route for login
router.post('/login', login);

// Debug route to get all users (Optional)
router.get('/users', getAllUsers);

module.exports = router;
