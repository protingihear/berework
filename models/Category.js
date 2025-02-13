const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const SubCategory = require("./SubCategory");

const Category = sequelize.define("Category", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
});

Category.hasMany(SubCategory, { as: "subcategories", foreignKey: "categoryId" });
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Category;
