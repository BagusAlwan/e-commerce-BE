const express = require('express');
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating } = require('../controller/productControler');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct)
router.put('/wishlist', authMiddleware, addToWishlist)
router.put('/rating', authMiddleware, rating)
router.get('/:id', getProduct)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.get('/', getAllProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
module.exports = router;