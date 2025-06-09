const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const UserSubCategoryProgress = require("../models/UserSubCategoryProgress");

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

// ✅ Ambil kategori beserta progres berdasarkan user
exports.getCategoryProgress = async (req, res) => {
    try {
        const { id } = req.params; // ID kategori
        const { userId } = req.query; // ID pengguna dari query params

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Ambil semua subkategori dalam kategori tertentu
        const subcategories = await SubCategory.findAll({
            where: { categoryId: id },
        });

        if (!subcategories.length) {
            return res.status(404).json({ message: "No subcategories found in this category" });
        }

        // Ambil progres user hanya untuk subkategori dalam kategori ini
        const subCategoryIds = subcategories.map(sub => sub.id);
        const userProgress = await UserSubCategoryProgress.findAll({
            where: { userId, subCategoryId: subCategoryIds },
        });

        // Hitung berapa banyak subkategori yang sudah selesai
        const completedSubcategories = userProgress.filter(sub => sub.done).length;
        const totalSubcategories = subcategories.length;

        // Hitung progres sebagai persentase
        const progress = totalSubcategories > 0 ? (completedSubcategories / totalSubcategories) * 100 : 0;

        res.json({
            categoryId: id,
            userId,
            progress: progress ,// Biarkan hasil dalam 2 desimal
            completedSubcategories,
            totalSubcategories,
        });
    } catch (error) {
        console.error("Error fetching category progress:", error);
        res.status(500).json({ message: "Error fetching category progress", error });
    }
};

// ✅ Update status subkategori berdasarkan user
exports.updateSubCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params; // ID Subkategori
        const { done, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Periksa apakah subkategori ini ada dalam database
        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // Cari progres user untuk subkategori ini
        let userProgress = await UserSubCategoryProgress.findOne({
            where: { userId, subCategoryId: id },
        });

        if (!userProgress) {
            // Jika belum ada, buat progres baru
            userProgress = await UserSubCategoryProgress.create({
                userId,
                subCategoryId: id,
                done,
            });
        } else {
            // Jika sudah ada, update statusnya
            userProgress.done = done;
            await userProgress.save();
        }

        res.json({ message: "SubCategory progress updated", userProgress });
    } catch (error) {
        console.error("Error updating subcategory progress:", error);
        res.status(500).json({ message: "Error updating subcategory progress", error });
    }
};
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = name || category.name;
        await category.save();

        res.json({ message: "Category updated", category });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
};
// Delete kategori berdasarkan ID
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.destroy();

        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
};
