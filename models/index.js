const sequelize = require('../config/database');
const User = require('./user');
const TemanTuli = require('./TemanTuli');
const TemanDengar = require('./TemanDengar');
const AhliBahasa = require('./AhliBahasa');
const UserSubCategoryProgress = require("./UserSubCategoryProgress");

// Relasi Kategori dengan SubKategori
Category.hasMany(SubCategory, { foreignKey: "categoryId", as: "subcategories" });
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

// Relasi User dengan Progres SubKategori
User.hasMany(UserSubCategoryProgress, { foreignKey: "userId" });
SubCategory.hasMany(UserSubCategoryProgress, { foreignKey: "subCategoryId" });

UserSubCategoryProgress.belongsTo(User, { foreignKey: "userId" });
UserSubCategoryProgress.belongsTo(SubCategory, { foreignKey: "subCategoryId",UserSubCategoryProgress });

const db = { sequelize, User, TemanTuli, TemanDengar, AhliBahasa, };

module.exports = db;
