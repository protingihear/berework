const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ✅ Buat komunitas baru (wajib login)
router.post("/api/communities", upload.single("foto"), authMiddleware, communityController.createCommunity);

// ✅ Edit komunitas (wajib login, hanya pemilik yang bisa edit)
router.put("/api/communities/:id", authMiddleware, communityController.editCommunity);

// ✅ Dapatkan semua komunitas
router.get("/api/communities", communityController.getCommunities);

// ✅ Dapatkan komunitas berdasarkan ID
router.get("/api/communities/:id", communityController.getCommunityById);

// ✅ Bergabung ke komunitas berdasarkan ID (wajib login)
router.post("/api/communities/:id/join", authMiddleware, communityController.joinCommunity);

// ✅ Keluar dari komunitas berdasarkan ID (wajib login)
router.post("/api/communities/:id/leave", authMiddleware, communityController.leaveCommunity);

// ✅ Dapatkan semua komunitas yang telah diikuti user
router.get("/api/communities/joined", authMiddleware, communityController.getJoinedCommunities);

// ✅ Buat postingan di komunitas (wajib login)
router.post("/api/communities/:id/posts", authMiddleware, communityController.createPost);

// ✅ Ambil semua postingan dari suatu komunitas
router.get("/api/communities/:id/posts", communityController.getCommunityPosts);

// ✅ Balas postingan atau reply lain dalam komunitas (wajib login)
router.post("/api/communities/:id/posts/:postId/replies", authMiddleware, communityController.createReply);

// ✅ Ambil semua balasan dalam komunitas
router.get("/api/communities/:id/replies", communityController.getCommunityReplies);

// ✅ Like postingan atau balasan (wajib login)
router.post("/api/communities/:id/posts/:postId/likes", authMiddleware, communityController.likeContent);
//router.get("/api/communities/posts/liked", authMiddleware, communityController.getPostsLikedByUser)
router.get("/api/communities/posts/liked", authMiddleware, communityController.getPostsLikedByUser);

module.exports = router;
