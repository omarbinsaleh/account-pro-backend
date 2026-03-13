const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define user related routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

// Export the router
module.exports = router;