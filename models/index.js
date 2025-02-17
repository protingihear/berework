const sequelize = require('../config/database');
const User = require('./user');
const TemanTuli = require('./TemanTuli');
const TemanDengar = require('./TemanDengar');
const AhliBahasa = require('./AhliBahasa');
const UserSubCategoryProgress = require("./UserSubCategoryProgress");
const Community = require("./Community");
const CommunityMember = require("./CommunityMember");
const CommunityPost = require("./CommunityPost");
const CommunityReply = require("./CommunityReply");
const CommunityLike = require("./CommunityLike");
// Relasi Kategori dengan SubKategori
Category.hasMany(SubCategory, { foreignKey: "categoryId", as: "subcategories" });
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

// Relasi User dengan Progres SubKategori
User.hasMany(UserSubCategoryProgress, { foreignKey: "userId" });
SubCategory.hasMany(UserSubCategoryProgress, { foreignKey: "subCategoryId" });

UserSubCategoryProgress.belongsTo(User, { foreignKey: "userId" });
UserSubCategoryProgress.belongsTo(SubCategory, { foreignKey: "subCategoryId",UserSubCategoryProgress });
// 1️⃣ User bisa membuat banyak komunitas
User.hasMany(Community, { foreignKey: "creatorId", as: "createdCommunities" });
Community.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

// 2️⃣ User bisa bergabung ke banyak komunitas
User.belongsToMany(Community, { through: CommunityMember, foreignKey: "userId", as: "joinedCommunities" });
Community.belongsToMany(User, { through: CommunityMember, foreignKey: "communityId", as: "members" });

// 3️⃣ Komunitas punya banyak postingan
Community.hasMany(CommunityPost, { foreignKey: "communityId", as: "posts" });
CommunityPost.belongsTo(Community, { foreignKey: "communityId", as: "community" });

// 4️⃣ User bisa membuat banyak postingan di komunitas
User.hasMany(CommunityPost, { foreignKey: "userId", as: "posts" });
CommunityPost.belongsTo(User, { foreignKey: "userId", as: "author" });

// 5️⃣ Postingan bisa memiliki banyak reply
CommunityPost.hasMany(CommunityReply, { foreignKey: "postId", as: "replies" });
CommunityReply.belongsTo(CommunityPost, { foreignKey: "postId", as: "post" });

// 6️⃣ Reply bisa memiliki reply lain (nested reply)
CommunityReply.hasMany(CommunityReply, { foreignKey: "replyId", as: "subReplies" });
CommunityReply.belongsTo(CommunityReply, { foreignKey: "replyId", as: "parentReply" });

// 7️⃣ User bisa like postingan
User.belongsToMany(CommunityPost, { through: CommunityLike, foreignKey: "userId", as: "likedPosts" });
CommunityPost.belongsToMany(User, { through: CommunityLike, foreignKey: "postId", as: "likedBy" });

// 8️⃣ User bisa like reply
User.belongsToMany(CommunityReply, { through: CommunityLike, foreignKey: "userId", as: "likedReplies" });
CommunityReply.belongsToMany(User, { through: CommunityLike, foreignKey: "replyId", as: "likedBy" });
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Database & tables synced!");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
};

const db = { sequelize, syncDatabase,User, TemanTuli, TemanDengar, AhliBahasa, Community,
    CommunityMember,
    CommunityPost,
    CommunityReply,
    CommunityLike };

module.exports = db;
