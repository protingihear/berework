const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityReply = sequelize.define("CommunityReply", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false // Harus selalu ada postId, tapi bisa null jika ini adalah nested reply
    },
    replyId: {
        type: DataTypes.INTEGER,
        allowNull: true // Hanya diisi jika reply ini adalah balasan dari reply lain
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// 🔹 Hubungan Nested Reply (Reply ke Reply)
CommunityReply.hasMany(CommunityReply, { foreignKey: "replyId", as: "nestedReplies" });
CommunityReply.belongsTo(CommunityReply, { foreignKey: "replyId", as: "parentReply" });

module.exports = CommunityReply;
