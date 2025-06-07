const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ✅ Create a new community (login required)
router.post("/api/communities", upload.single("foto"), authMiddleware, communityController.createCommunity);

// ✅ Edit community (login required, only creator can edit)
router.put("/api/communities/:id", authMiddleware, communityController.editCommunity);

// ✅ Delete community (login required, only creator can delete)
router.delete("/api/communities/:id", authMiddleware, communityController.deleteCommunity);

// ✅ Get all communities
router.get("/api/communities", communityController.getCommunities);

// ✅ Like post (login required)
router.post("/api/communities/:id/posts/:postId/likes", authMiddleware, communityController.likeContent);

// ✅ Unlike post (login required)
router.delete("/api/communities/:id/posts/:postId/likes", authMiddleware, communityController.unlikeContent);

// ✅ Get communities joined by the user (login required)
router.get("/api/communities/joined", authMiddleware, communityController.getJoinedCommunities);

// ✅ Leave a community by ID (login required)
router.post("/api/communities/:id/leave", authMiddleware, communityController.leaveCommunity);

// ✅ Get community members by ID (login required)
router.get("/api/communities/:id/members", authMiddleware, communityController.getCommunityMembers);

// ✅ Get community by ID (details)
router.get("/api/communities/:id", communityController.getCommunityById);

// ✅ Join a community by ID (login required)
router.post("/api/communities/:id/join", authMiddleware, communityController.joinCommunity);

// ✅ Create a post in a community (login required)
router.post("/api/communities/:id/posts", authMiddleware, communityController.createPost);

// ✅ Get all posts from a community
router.get("/api/communities/:id/posts", communityController.getCommunityPosts);

// ✅ Reply to a post or another reply in a community (login required)
router.post("/api/communities/:id/posts/:postId/replies", authMiddleware, communityController.createReply);

// ✅ Get all replies within a community (this route might need adjustment if you want replies for specific posts)
router.get("/api/communities/:id/replies", communityController.getCommunityReplies);

// ✅ Get all posts liked by the user (login required)
router.get("/api/communities/posts/liked", authMiddleware, communityController.getPostsLikedByUser);

// ✅ Get all posts created by the logged-in user (login required)
router.get("/api/posts/mine", authMiddleware, communityController.getMyPosts);

module.exports = router;