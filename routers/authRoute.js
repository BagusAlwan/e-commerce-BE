const express = require('express');
const { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, createOrder, getOrders, updateOrderStatus } = require('../controller/userControler');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.get('/all-users', getAllUser);
router.get('/get-orders', authMiddleware, getOrders);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.post('/cart', authMiddleware, userCart)
router.get('/wishlist',authMiddleware, getWishlist);
router.get('/cart',authMiddleware, getUserCart);
router.post('/cart/cash-order', authMiddleware, createOrder);
router.get('/:id',authMiddleware, isAdmin, getUser);
router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.put('/changePass', authMiddleware ,updatePassword)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);
module.exports = router;