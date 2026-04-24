const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Define user related routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/logout/:id', authMiddleware.authUser, userController.logoutUser);
router.get('/', authMiddleware.authUser, authMiddleware.authCompany, userController.getAllUsers);
router.get('/:id', authMiddleware.authUser, authMiddleware.authCompany, userController.getUserById);
router.patch('/:id', authMiddleware.authUser, authMiddleware.authCompany, userController.updateUserById);
router.delete('/:id', authMiddleware.authUser, authMiddleware.authCompany, userController.deleteUserById);

// Export the router
module.exports = router;