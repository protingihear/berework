const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityReply = sequelize.define("CommunityReply", {
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
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

module.exports = CommunityReply;
