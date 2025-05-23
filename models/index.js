const Sequelize = require("sequelize");
const sequelize = require("../config/database");

// ✅ Import Models
const User = require("./user");
const Community = require("./Community");
const CommunityMember = require("./CommunityMember");
const CommunityPost = require("./CommunityPost");
const CommunityReply = require("./CommunityReply");
const CommunityLike = require("./CommunityLike");
const TemanTuli = require("./TemanTuli");
const TemanDengar = require("./TemanDengar");
const AhliBahasa = require("./AhliBahasa");
const UserSubCategoryProgress = require("./UserSubCategoryProgress");

// ✅ Define Relationships in a Single Section
(() => {
    // User & Community Relationship
    User.hasMany(Community, { foreignKey: "creatorId", as: "createdCommunities" });
    Community.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

    // Many-to-Many: User & Community
    User.belongsToMany(Community, { through: CommunityMember, foreignKey: "userId", as: "joinedCommunities" });
    Community.belongsToMany(User, { through: CommunityMember, foreignKey: "communityId", as: "communityMembers" });

    // Community & Post Relationship
    Community.hasMany(CommunityPost, { foreignKey: 'communityId', as: 'posts', onDelete: 'CASCADE' });
    CommunityPost.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

    // User & Post Relationship
    User.hasMany(CommunityPost, { foreignKey: "userId", as: "posts" });
    CommunityPost.belongsTo(User, { foreignKey: "userId", as: "author" });

    // Post & Reply Relationship (One-to-Many)
    CommunityPost.hasMany(CommunityReply, { foreignKey: "postId", as: "replies" });
    CommunityReply.belongsTo(CommunityPost, { foreignKey: "postId", as: "post" });

    // Reply & User Relationship
    CommunityReply.belongsTo(User, { foreignKey: "userId", as: "author" });
    
    // Nested Reply (Reply within Reply)
    CommunityReply.hasMany(CommunityReply, { foreignKey: "replyId", as: "subReplies" });
    CommunityReply.belongsTo(CommunityReply, { foreignKey: "replyId", as: "parentReply" });

    // Many-to-Many: User & Post Likes
    User.belongsToMany(CommunityPost, { through: CommunityLike, foreignKey: "userId", as: "likedPosts" });
    CommunityPost.belongsToMany(User, { through: CommunityLike, foreignKey: "postId", as: "postLikers" });

    // Many-to-Many: User & Reply Likes
    User.belongsToMany(CommunityReply, { through: CommunityLike, foreignKey: "userId", as: "likedReplies" });
    CommunityReply.belongsToMany(User, { through: CommunityLike, foreignKey: "replyId", as: "replyLikers" });
})();
// ✅ Sync Database
const syncDatabase = async () => {
    try {
        await sequelize.sync();
        console.log("✅ Database & tables synced!");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
};

// ✅ Export Models
const db = {
    sequelize,
    syncDatabase,
    User,
    Community,
    CommunityMember,
    CommunityPost,
    CommunityReply,
    CommunityLike,
    TemanTuli,
    TemanDengar,
    AhliBahasa,
    UserSubCategoryProgress
};

module.exports = db;
