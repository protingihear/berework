const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

// Buat kategori baru
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
};
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: { model: SubCategory, as: "subcategories" }
        });

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

// ✅ Dapatkan kategori berdasarkan ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id, {
            include: { model: SubCategory, as: "subcategories" }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error });
    }
};

// Dapatkan kategori beserta progres berdasarkan jumlah subkategori yang selesai
exports.getCategoryProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id, {
            include: { model: SubCategory, as: "subcategories" }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const totalSubcategories = category.subcategories.length;
        const completedSubcategories = category.subcategories.filter(sub => sub.done).length;

        // Hitung progres (jika tidak ada subkategori, progres = 0%)
        const progress = totalSubcategories > 0 ? (completedSubcategories / totalSubcategories) * 100 : 0;

        res.json({ category, progress });
    } catch (error) {
        res.status(500).json({ message: "Error fetching category progress", error });
    }
};

// Tandai subkategori sebagai selesai
exports.updateSubCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { done } = req.body;

        const subcategory = await SubCategory.findByPk(id);
        if (!subcategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        subcategory.done = done;
        await subcategory.save();

        res.json({ message: "SubCategory updated", subcategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating subcategory", error });
    }
};
