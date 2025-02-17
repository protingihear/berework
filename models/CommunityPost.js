const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityPost = sequelize.define("CommunityPost", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    communityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

module.exports = CommunityPost;
