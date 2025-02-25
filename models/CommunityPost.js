const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Community = require("./Community");

const CommunityPost = sequelize.define("CommunityPost", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    communityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Community, // 🔹 Tambahin ini biar Sequelize paham relasinya
            key: "id"
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = CommunityPost;
