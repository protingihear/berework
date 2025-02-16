const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const subcategoryController = require('../controllers/subcategoryController');

// Route untuk kategori

router.get("/api/categories", categoryController.getCategories);
router.get("/api/categories/:id", categoryController.getCategoryById);

router.get("/api/categories/:id/progress", categoryController.getCategoryProgress);

router.post("/api/categories", categoryController.createCategory);


// Route untuk menambahkan subkategori ke kategori tertentu
router.post('/api/categories/:categoryId/subcategories', subcategoryController.createSubcategory);
router.get('/api/categories/:categoryId/subcategories', subcategoryController.getSubcategoriesByCategory);

router.put("/api/subcategories/:id/status", categoryController.updateSubCategoryStatus);
// ✅ Ambil kategori dengan progres berdasarkan user
router.get("/api/categories/:id/progress", categoryController.getCategoryProgress);

// ✅ Update status subkategori berdasarkan user
router.put("/api/subcategories/:id/status", categoryController.updateSubCategoryStatus);

module.exports = router;
