const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityLike = sequelize.define("CommunityLike", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    replyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

module.exports = CommunityLike;
