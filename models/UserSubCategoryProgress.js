const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserSubCategoryProgress = sequelize.define("UserSubCategoryProgress", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = UserSubCategoryProgress;
