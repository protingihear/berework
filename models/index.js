const sequelize = require("../config/database");
const User = require("./user");
const TemanTuli = require("./TemanTuli");
const TemanDengar = require("./TemanDengar");
const AhliBahasa = require("./AhliBahasa");
const UserSubCategoryProgress = require("./UserSubCategoryProgress");
const Community = require("./Community");
const CommunityMember = require("./CommunityMember");
const CommunityPost = require("./CommunityPost");
const CommunityReply = require("./CommunityReply");
const CommunityLike = require("./CommunityLike");

// Relasi User dengan Komunitas
User.hasMany(Community, { foreignKey: "creatorId", as: "createdCommunities" });
Community.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

// User bisa join ke banyak komunitas
User.belongsToMany(Community, { through: CommunityMember, foreignKey: "userId", as: "joinedCommunities" });
Community.belongsToMany(User, { through: CommunityMember, foreignKey: "communityId", as: "members" });

// Komunitas memiliki banyak postingan
Community.hasMany(CommunityPost, { foreignKey: "communityId", as: "posts" });
CommunityPost.belongsTo(Community, { foreignKey: "communityId", as: "community" });

// User bisa membuat banyak postingan
User.hasMany(CommunityPost, { foreignKey: "userId", as: "posts" });
CommunityPost.belongsTo(User, { foreignKey: "userId", as: "author" });

// Postingan memiliki banyak reply
CommunityPost.hasMany(CommunityReply, { foreignKey: "postId", as: "replies" });
CommunityReply.belongsTo(CommunityPost, { foreignKey: "postId", as: "post" });

// Nested reply (balasan dalam balasan)
CommunityReply.hasMany(CommunityReply, { foreignKey: "replyId", as: "subReplies" });
CommunityReply.belongsTo(CommunityReply, { foreignKey: "replyId", as: "parentReply" });

// User bisa like postingan
User.belongsToMany(CommunityPost, { through: CommunityLike, foreignKey: "userId", as: "likedPosts" });
CommunityPost.belongsToMany(User, { through: CommunityLike, foreignKey: "postId", as: "likedBy" });

// User bisa like reply
User.belongsToMany(CommunityReply, { through: CommunityLike, foreignKey: "userId", as: "likedReplies" });
CommunityReply.belongsToMany(User, { through: CommunityLike, foreignKey: "replyId", as: "likedBy" });


// 🔹 Hubungan antar model
User.hasMany(CommunityPost, { foreignKey: "userId", as: "posts" });
CommunityPost.belongsTo(User, { foreignKey: "userId", as: "author" });

User.hasMany(CommunityReply, { foreignKey: "userId", as: "replies" });
CommunityReply.belongsTo(User, { foreignKey: "userId", as: "author" });

CommunityPost.hasMany(CommunityReply, { foreignKey: "postId", as: "replies" });
CommunityReply.belongsTo(CommunityPost, { foreignKey: "postId", as: "post" });

CommunityPost.hasMany(CommunityLike, { foreignKey: "postId", as: "likes" });
CommunityLike.belongsTo(CommunityPost, { foreignKey: "postId", as: "post" });


const syncDatabase = async () => {
    try {
        await sequelize.sync(); // Hapus alter: true jika di produksi
        console.log("✅ Database & tables synced!");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
};

const db = {
    sequelize,
    syncDatabase,
    User,
    TemanTuli,
    TemanDengar,
    AhliBahasa,
    Community,
    CommunityMember,
    CommunityPost,
    CommunityReply,
    CommunityLike
};

module.exports = db;
