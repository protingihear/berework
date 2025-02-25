const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityReply = require("./CommunityReply");
const CommunityLike = require("./CommunityLike");
// const User = require("./user");
const CommunityPost = sequelize.define("CommunityPost", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    communityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// 🔹 Hubungan dengan Reply
CommunityPost.hasMany(CommunityReply, { foreignKey: "postId", as: "replies" });
CommunityPost.hasMany(CommunityLike, { foreignKey: "postId", as: "likes" });
module.exports = CommunityPost;
