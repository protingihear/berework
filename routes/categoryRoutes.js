const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const subcategoryController = require('../controllers/subcategoryController');

// Route untuk kategori

router.get("/api/categories", categoryController.getCategories);
router.get("/api/categories/:id", categoryController.getCategoryById);

router.get("/api/categories/:id/progress", categoryController.getCategoryProgress);

router.post("/api/categories", categoryController.createCategory);


router.post('/api/categories/:categoryId/subcategories', subcategoryController.createSubcategory);
router.get('/api/categories/:categoryId/subcategories', subcategoryController.getSubcategoriesByCategory);

router.put("/api/subcategories/:id/status", categoryController.updateSubCategoryStatus);
router.get("/api/categories/:id/progress", categoryController.getCategoryProgress);
router.put("/api/categories/:id", categoryController.updateCategory);
router.delete("/api/categories/:id", categoryController.deleteCategory);
router.put("/api/subcategories/:id/status", categoryController.updateSubCategoryStatus);
// Update dan delete subkategori
router.put("/api/subcategories/:id", subcategoryController.updateSubcategory);
router.delete("/api/subcategories/:id", subcategoryController.deleteSubcategory);

module.exports = router;

