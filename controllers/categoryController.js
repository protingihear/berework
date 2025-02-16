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
        const { userId } = req.query; // User ID dari query params

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Ambil semua subkategori dalam kategori ini
        const subcategories = await SubCategory.findAll({ where: { categoryId: id } });

        if (!subcategories.length) {
            return res.status(404).json({ message: "No subcategories found in this category" });
        }

        // Ambil progres subkategori berdasarkan user
        const userProgress = await UserSubCategoryProgress.findAll({
            where: { userId },
        });

        // Hitung progres
        const totalSubcategories = subcategories.length;
        const completedSubcategories = userProgress.filter(sub => sub.done).length;

        const progress = totalSubcategories > 0 ? (completedSubcategories / totalSubcategories) * 100 : 0;

        res.json({ categoryId: id, progress, subcategories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching category progress", error });
    }
};

// ✅ Update status subkategori berdasarkan user
exports.updateSubCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { done, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Cek apakah user sudah memiliki progres di subkategori ini
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
        res.status(500).json({ message: "Error updating subcategory progress", error });
    }
};