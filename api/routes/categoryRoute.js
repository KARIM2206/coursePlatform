const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controllers');
const allowedTo = require('../middleware/allowedTo');
const isAuth = require('../middleware/auth');

// Create category
router.post('/', isAuth,allowedTo('teacher'),createCategory);

// Get all categories
router.get('/',getCategories);

// Update category
router.put('/:id', isAuth,allowedTo('teacher'),updateCategory);

// Delete category
router.delete('/:id', isAuth,allowedTo('teacher'),deleteCategory);

module.exports = router;