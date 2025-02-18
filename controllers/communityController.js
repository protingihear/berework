const Community = require("../models/Community");
const CommunityMember = require("../models/CommunityMember");
const CommunityPost = require("../models/CommunityPost");
const CommunityReply = require("../models/CommunityReply");
const CommunityLike = require("../models/CommunityLike");

// ✅ Buat komunitas
exports.createCommunity = async (req, res) => {
 try {
        const { name, description } = req.body;
        const creatorId = req.session.userId; // Sekarang req.user.id ada karena middleware diperbaiki

        const community = await Community.create({ name, description, creatorId });

        res.status(201).json({ message: "Community created", community });
    } catch (error) {
        res.status(500).json({ message: "Error creating community", error });
    }
};

// ✅ Edit komunitas (hanya pemilik)
exports.editCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, userId } = req.body;
        
        const community = await Community.findByPk(id);
        if (!community) return res.status(404).json({ message: "Community not found" });

        if (community.creatorId !== userId) {
            return res.status(403).json({ message: "Unauthorized to edit this community" });
        }

        community.name = name;
        community.description = description;
        await community.save();

        res.json({ message: "Community updated", community });
    } catch (error) {
        res.status(500).json({ message: "Error updating community", error });
    }
};

// ✅ Join komunitas
exports.joinCommunity = async (req, res) => {
    try {
        const { userId, communityId } = req.body;

        await CommunityMember.create({ userId, communityId });

        res.json({ message: "Joined community successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error joining community", error });
    }
};

// ✅ Post di komunitas
exports.createPost = async (req, res) => {
    try {
        const { userId, communityId, content } = req.body;

        const post = await CommunityPost.create({ userId, communityId, content });

        res.json({ message: "Post created", post });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
};

// ✅ Reply ke post atau reply lain
exports.createReply = async (req, res) => {
    try {
        const { userId, postId, replyId, content } = req.body;

        const reply = await CommunityReply.create({ userId, postId, replyId, content });

        res.json({ message: "Reply created", reply });
    } catch (error) {
        res.status(500).json({ message: "Error creating reply", error });
    }
};

// ✅ Like post atau reply
exports.likeContent = async (req, res) => {
    try {
        const { userId, postId, replyId } = req.body;

        await CommunityLike.create({ userId, postId, replyId });

        res.json({ message: "Liked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error liking content", error });
    }
};
exports.getCommunities = async (req, res) => {
    try {
        const communities = await Community.findAll();
        res.json(communities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching communities", error });
    }
};

// ✅ Fungsi untuk mendapatkan detail komunitas berdasarkan ID
exports.getCommunityById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Pastikan middleware auth telah menambahkan userId
        
        const community = await Community.findByPk(id, {
            attributes: ["id", "name", "description"],
        });

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Cek apakah user sudah join komunitas
        const isMember = await UserCommunity.findOne({
            where: { userId, communityId: id }
        });

        if (!isMember) {
            return res.json({
                message: "Join the community to see posts and likes",
                community
            });
        }

        // Jika sudah join, fetch posts dan likes
        const posts = await Post.findAll({
            where: { communityId: id },
            include: [{ model: Like, as: "likes" }]
        });

        res.json({ community, posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching community", error });
    }
};
// ✅ Fungsi untuk keluar dari komunitas
exports.leaveCommunity = async (req, res) => {
    try {
        const { id } = req.params; // ID komunitas
        const userId = req.user.id; // ID pengguna dari session/auth

        const membership = await CommunityMember.findOne({ where: { userId, communityId: id } });

        if (!membership) {
            return res.status(404).json({ message: "You are not a member of this community" });
        }

        await membership.destroy();

        res.json({ message: "Successfully left the community" });
    } catch (error) {
        res.status(500).json({ message: "Error leaving community", error });
    }
};
