const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityLike = sequelize.define("CommunityLike", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    replyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
});

// 🔹 Relationships (defined in index.js to avoid circular dependencies)
module.exports = CommunityLike;
