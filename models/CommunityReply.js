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
        allowNull: true // Harus selalu ada postId, tapi bisa null jika ini adalah nested reply
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

CommunityReply.addHook("beforeValidate", (reply) => {
    if (!reply.postId && !reply.replyId) {
        throw new Error("CommunityReply harus punya postId atau replyId");
    }
});


// 🔹 Relationships (defined in index.js to avoid circular dependencies)
module.exports = CommunityReply;
