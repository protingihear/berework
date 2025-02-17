const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Buat komunitas baru
//router.post("/api/communities", communityController.createCommunity);
router.post("/api/communities", authMiddleware, communityController.createCommunity);
// ✅ Edit komunitas
router.put("/api/communities/:id", communityController.editCommunity);

// ✅ Dapatkan semua komunitas
router.get("/api/communities", communityController.getCommunities);

// ✅ Dapatkan komunitas berdasarkan ID
router.get("/api/communities/:id", communityController.getCommunityById);

// ✅ Bergabung ke komunitas berdasarkan ID
router.post("/api/communities/:id/join", communityController.joinCommunity);

// ✅ Keluar dari komunitas berdasarkan ID
router.post("/api/communities/:id/leave", communityController.leaveCommunity);

// ✅ Buat postingan di komunitas
router.post("/api/communities/:id/posts", communityController.createPost);

// ✅ Balas postingan komunitas
router.post("/api/communities/:id/posts/:postId/replies", communityController.createReply);

// ✅ Like postingan atau balasan
router.post("/api/communities/:id/posts/:postId/likes", communityController.likeContent);

module.exports = router;
