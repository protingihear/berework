const Subcategory = require('../models/SubCategory');
const Category = require('../models/Category');

exports.createSubcategory = async (req, res) => {
    try {
        const { name, video, description, done } = req.body;
        const { categoryId } = req.params;

        // Cek apakah kategori ada
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Buat subkategori baru
        const subcategory = await Subcategory.create({
            categoryId,
            name,
            video,
            description,
            done: done || false
        });

        res.status(201).json(subcategory);
    } catch (error) {
        console.error("Error creating subcategory:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getSubcategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Ambil semua subkategori berdasarkan kategori
        const subcategories = await Subcategory.findAll({
            where: { categoryId }
        });

        res.json(subcategories);
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
