const Community = require("../models/Community");
const CommunityMember = require("../models/CommunityMember");
const CommunityPost = require("../models/CommunityPost");
const CommunityReply = require("../models/CommunityReply");
const CommunityLike = require("../models/CommunityLike");

// ✅ Buat komunitas
exports.createCommunity = async (req, res) => {
    try {
        const { name, description } = req.body;
        const foto = req.file ? req.file.buffer.toString("base64") : null; // Konversi file ke Base64
        const creatorId = req.session.userId; // Gunakan session untuk mendapatkan userId

        const community = await Community.create({ name, description, creatorId, foto });

        res.status(201).json({ message: "Community created", community });
    } catch (error) {
        res.status(500).json({ message: "Error creating community", error });
    }
};

// ✅ Edit komunitas (hanya pemilik)
exports.editCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const userId = req.session.userId; // Gunakan session

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
        const userId = req.session.userId; // Gunakan session
        const communityId = req.params.id; // Ambil communityId dari URL params

        if (!userId) {
            return res.status(400).json({ message: "User ID tidak ditemukan" });
        }
        if (!communityId) {
            return res.status(400).json({ message: "Community ID tidak ditemukan" });
        }

        const community = await Community.findByPk(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community tidak ditemukan" });
        }

        // Cek apakah user sudah bergabung sebelumnya
        const existingMember = await CommunityMember.findOne({ where: { userId, communityId } });
        if (existingMember) {
            return res.status(400).json({ message: "Anda sudah bergabung dalam komunitas ini" });
        }

        // Tambahkan keanggotaannya
        await CommunityMember.create({ userId, communityId });

        res.json({ message: "Berhasil bergabung dengan komunitas" });
    } catch (error) {
        console.error("Error saat join komunitas:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat join komunitas", error });
    }
};

// ✅ Post di komunitas
exports.createPost = async (req, res) => {
    try {
        const { communityId, content } = req.body;
        const userId = req.session.userId; // Gunakan session untuk userId

        const post = await CommunityPost.create({ userId, communityId, content });

        res.json({ message: "Post created", post });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
};

// ✅ Reply ke post atau reply lain
exports.createReply = async (req, res) => {
    try {
        const { postId, replyId, content } = req.body;
        const userId = req.session.userId; // Gunakan session untuk userId

        const reply = await CommunityReply.create({ userId, postId, replyId, content });

        res.json({ message: "Reply created", reply });
    } catch (error) {
        res.status(500).json({ message: "Error creating reply", error });
    }
};

// ✅ Like post atau reply
exports.likeContent = async (req, res) => {
    try {
        const { postId, replyId } = req.body;
        const userId = req.session.userId; // Gunakan session untuk userId

        await CommunityLike.create({ userId, postId, replyId });

        res.json({ message: "Liked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error liking content", error });
    }
};

// ✅ Ambil semua komunitas
exports.getCommunities = async (req, res) => {
    try {
        const communities = await Community.findAll();
        res.json(communities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching communities", error });
    }
};

// ✅ Detail komunitas
exports.getCommunityById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId; // Gunakan session

        const community = await Community.findByPk(id, {
            attributes: ["id", "name", "description"],
        });

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Cek apakah user sudah join komunitas
        const isMember = await CommunityMember.findOne({
            where: { userId, communityId: id }
        });

        if (!isMember) {
            return res.json({
                message: "Join the community to see posts and likes",
                community
            });
        }

        // Jika sudah join, fetch posts dan likes
        const posts = await CommunityPost.findAll({
            where: { communityId: id },
            include: [{ model: CommunityLike, as: "likes" }]
        });

        res.json({ community, posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching community", error });
    }
};

// ✅ Keluar dari komunitas
exports.leaveCommunity = async (req, res) => {
    try {
        const { id } = req.params; // ID komunitas
        const userId = req.session.userId; // Gunakan session untuk userId

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

exports.getJoinedCommunities = async (req, res) => {
    try {
        const userId = req.session.userId; // Pastikan userId diambil dari sesi autentikasi

        if (!userId) {
            return res.status(401).json({ message: "User ID tidak ditemukan, silakan login" });
        }

        // Cari semua komunitas yang diikuti oleh user
        const joinedCommunities = await Community.findAll({
            include: {
                model: CommunityMember,
                as: "members",  // Sesuai dengan relasi yang didefinisikan di atas
                where: { userId },
                attributes: []  // Hanya mengambil data Community, bukan CommunityMember
            }
        });

        res.json({ message: "Daftar komunitas yang diikuti", joinedCommunities });
    } catch (error) {
        console.error("Error fetching joined communities:", error);
        res.status(500).json({ message: "Error fetching joined communities", error });
    }
};

