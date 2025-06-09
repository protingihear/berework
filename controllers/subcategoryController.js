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
exports.updateSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, video, description, done } = req.body;

        const subcategory = await Subcategory.findByPk(id);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // Update fields jika ada di request body
        if (name !== undefined) subcategory.name = name;
        if (video !== undefined) subcategory.video = video;
        if (description !== undefined) subcategory.description = description;
        if (done !== undefined) subcategory.done = done;

        await subcategory.save();

        res.json({ message: "Subcategory updated", subcategory });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;

        const subcategory = await Subcategory.findByPk(id);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        await subcategory.destroy();

        res.json({ message: "Subcategory deleted" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
