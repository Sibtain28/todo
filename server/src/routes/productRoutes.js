const express = require('express');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getProducts); // Protected but accessible to all users
router.post('/', authenticateToken, authorizeAdmin, createProduct); // Admin only
router.put('/:id', authenticateToken, authorizeAdmin, updateProduct); // Admin only
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct); // Admin only

module.exports = router;
