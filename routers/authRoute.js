const express = require('express');
const { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userControler');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id',authMiddleware, isAdmin, getUser);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.put('/changePass', authMiddleware ,updatePassword)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
module.exports = router;