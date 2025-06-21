const Category = require('../models/categoryModel');

// Create Category
const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ ok: false, message: "Category name is required" });
        }
        const exists = await Category.findOne({ name: name.trim() });
        if (exists) {
            return res.status(409).json({ ok: false, message: "Category already exists" });
        }
        const category = await Category.create({ name: name.trim() });
        res.status(201).json({ ok: true, message: "Category created successfully", category });
    } catch (error) {
        next(error);
    }
};

// Get All Categories
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ ok: true, categories });
    } catch (error) {
        next(error);
    }
};

// Update Category
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(
            id,
            { name: name?.trim() },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ ok: false, message: "Category not found" });
        }
        res.status(200).json({ ok: true, message: "Category updated", category });
    } catch (error) {
        next(error);
    }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ ok: false, message: "Category not found" });
        }
        res.status(200).json({ ok: true, message: "Category deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};