const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityReply = require("./CommunityReply");
const CommunityLike = require("./CommunityLike");
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
CommunityPost.hasMany(CommunityReply, { foreignKey: "postId", as: "replies" });
CommunityPost.hasMany(CommunityLike, { foreignKey: "postId", as: "likes" });


module.exports = CommunityPost;  // Pastikan model diekspor dengan benar
