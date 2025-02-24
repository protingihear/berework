const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const CommunityPost = require("./CommunityPost");

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

CommunityPost.hasMany(CommunityReply, { foreignKey: "postId", as: "replies" });
CommunityReply.belongsTo(CommunityPost, { foreignKey: "postId", as: "post" });

// 🔹 Hubungan dengan Balasan Lain (Nested Reply)
CommunityReply.hasMany(CommunityReply, { foreignKey: "replyId", as: "nestedReplies" });
CommunityReply.belongsTo(CommunityReply, { foreignKey: "replyId", as: "parentReply" });

module.exports = CommunityReply;
