const { Community, CommunityMember, CommunityPost, CommunityReply, CommunityLike, User } = require("../models");
// ✅ Buat komunitas
async function resetLikedByField() {
  try {
    const posts = await CommunityPost.findAll();

    for (const post of posts) {
      let likedBy = post.likedBy;

      let isInvalid = false;
      if (!likedBy) {
        isInvalid = true;
      } else if (!Array.isArray(likedBy)) {
        try {
          likedBy = JSON.parse(likedBy);
          if (!Array.isArray(likedBy)) {
            isInvalid = true;
          }
        } catch {
          isInvalid = true;
        }
      }

      if (isInvalid) {
        post.likedBy = [];
        await post.save();
        console.log(`Reset likedBy for post id ${post.id}`);
      }
    }
    console.log('Reset likedBy selesai.');
  } catch (err) {
    console.error('Error reset likedBy:', err);
  }
}

// Jalankan fungsi
resetLikedByField();
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
        const userId = req.session.userId;

        if (!postId && !replyId) {
            return res.status(400).json({ message: "postId atau replyId harus diisi" });
        }

        if (replyId) {
            // Cek apakah reply yang akan dijawab itu benar-benar ada
            const parentReply = await CommunityReply.findByPk(replyId);
            if (!parentReply) {
                return res.status(404).json({ message: "Reply yang ingin dibalas tidak ditemukan" });
            }
            // Pastikan replyId berasal dari post yang sama
            if (parentReply.postId !== postId) {
                return res.status(400).json({ message: "Reply harus berasal dari post yang sama" });
            }
        } else {
            // Jika ini adalah reply pertama, cek apakah post-nya ada
            const post = await CommunityPost.findByPk(postId);
            if (!post) {
                return res.status(404).json({ message: "Post tidak ditemukan" });
            }
        }

        const reply = await CommunityReply.create({ userId, postId, replyId, content });

        res.json({ message: "Reply created", reply });
    } catch (error) {
        res.status(500).json({ message: "Error creating reply", error });
    }
};

// ✅ Like post atau reply

exports.likeContent = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.params.postId;

    if (!postId || !userId) {
      return res.status(400).json({ message: "postId and user session are required" });
    }

    // Cari postingan
    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Pastikan likedBy selalu array
    let likedBy;
    try {
      likedBy = Array.isArray(post.likedBy) ? post.likedBy : JSON.parse(post.likedBy || '[]');
    } catch {
      likedBy = [];
    }

    // Convert userId ke string (untuk perbandingan konsisten)
    const userIdStr = String(userId);
    const likedByStr = likedBy.map(String);

    // Cek user sudah like atau belum
    if (likedByStr.includes(userIdStr)) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    likedBy.push(userId);
    post.likedBy = likedBy;

    await post.save();

    return res.json({ message: "Liked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error liking content", error: error.message });
  }
};

  
exports.unlikeContent = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.params.postId;

    if (!postId || !userId) {
      return res.status(400).json({ message: "postId and user session are required" });
    }

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let likedBy;
    try {
      likedBy = Array.isArray(post.likedBy) ? post.likedBy : JSON.parse(post.likedBy || '[]');
    } catch {
      likedBy = [];
    }

    const userIdStr = String(userId);
    const likedByStr = likedBy.map(String);

    if (!likedByStr.includes(userIdStr)) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    // Filter hapus userId dari array likedBy
    const newLikedBy = likedBy.filter(id => String(id) !== userIdStr);

    post.likedBy = newLikedBy;
    await post.save();

    return res.json({ message: "Unliked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error unliking content", error: error.message });
  }
};
exports.unlikeContent = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.params.postId;

    if (!postId || !userId) {
      return res.status(400).json({ message: "postId and user session are required" });
    }

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let likedBy;
    try {
      likedBy = Array.isArray(post.likedBy) ? post.likedBy : JSON.parse(post.likedBy || '[]');
    } catch {
      likedBy = [];
    }

    const userIdStr = String(userId);
    const likedByStr = likedBy.map(String);

    if (!likedByStr.includes(userIdStr)) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    // Filter hapus userId dari array likedBy
    const newLikedBy = likedBy.filter(id => String(id) !== userIdStr);

    post.likedBy = newLikedBy;
    await post.save();

    return res.json({ message: "Unliked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error unliking content", error: error.message });
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


exports.getCommunityReplies = async (req, res) => {
    try {
        const { communityId } = req.params; // Ambil ID komunitas dari parameter URL

        // Cek apakah komunitas ada
        const community = await Community.findByPk(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Ambil semua post di komunitas tersebut
        const posts = await CommunityPost.findAll({
            where: { communityId },
            attributes: ["id", "content", "userId", "createdAt"],
            include: [
                {
                    model: CommunityReply,
                    as: "replies",
                    attributes: ["id", "content", "userId", "postId", "replyId", "createdAt"],
                    include: [
                        {
                            model: CommunityReply,
                            as: "nestedReplies",
                            attributes: ["id", "content", "userId", "postId", "replyId", "createdAt"]
                        }
                    ]
                }
            ]
        });

        res.json({ message: "Replies for the community posts", posts });
    } catch (error) {
        console.error("Error fetching community replies:", error);
        res.status(500).json({ message: "Error fetching community replies", error });
    }
};

exports.getCommunityPosts = async (req, res) => {
    try {
        const { id } = req.params; // ID komunitas dari URL

        // Ambil semua postingan dari komunitas tertentu
        const posts = await CommunityPost.findAll({
            where: { communityId: id },
            include: [
                {
                    model: User,
                    as: "author", 
                    attributes: ["id", "username"] // Info user yang membuat post
                },
                {
                    model: CommunityReply,
                    as: "replies",
                    attributes: ["id", "content", "userId", "createdAt"],
                    include: [
                        {
                            model: User,
                            as: "author", // alias for nested User in replies
                            attributes: ["id", "username"]
                        }
                    ]
                },
                //belom, malas.
                // {
                //     model: CommunityLike,
                //     as: "likes",
                //     attributes: ["id", "userId"] // Like pada postingan
                // }
            ],
            order: [["createdAt", "DESC"]] // Urutkan dari postingan terbaru
        });

        res.status(200).json({
            message: "Postingan komunitas berhasil diambil",
            posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil postingan komunitas",
            error: error.message
        });
    }
};
// ✅ Balas postingan atau balasan lain dalam komunitas
exports.createReply = async (req, res) => {
    try {
        const { content } = req.body;
        const { id, postId } = req.params; // ID komunitas & ID post
        const userId = req.session.userId; // Ambil userId dari sesi
        const { replyId } = req.body; // Jika ini adalah balasan ke balasan lain

        if (!content) {
            return res.status(400).json({ message: "Konten reply tidak boleh kosong" });
        }

        // Cek apakah post yang akan dibalas benar-benar ada
        const post = await CommunityPost.findOne({ where: { id: postId, communityId: id } });
        if (!post) {
            return res.status(404).json({ message: "Post tidak ditemukan dalam komunitas ini" });
        }

        if (replyId) {
            // Cek apakah reply yang ingin dibalas ada
            const parentReply = await CommunityReply.findByPk(replyId);
            if (!parentReply) {
                return res.status(404).json({ message: "Reply yang ingin dibalas tidak ditemukan" });
            }
        }

        // Buat balasan
        const reply = await CommunityReply.create({ userId, postId, replyId, content });

        res.status(201).json({ message: "Reply berhasil dibuat", reply });
    } catch (error) {
        console.error("Error creating reply:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat reply", error });
    }
    // Ambil semua post yang pernah di-like oleh user
}
// ✅ Ambil semua post yang pernah di-like oleh user
exports.getPostsLikedByUser = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Silakan login terlebih dahulu" });
        }

        const likedPosts = await CommunityLike.findAll({
            where: {
                userId,
                postId: { [require("sequelize").Op.ne]: null }
            },
            include: [
                {
                    model: CommunityPost,
                    as: "post",
                    include: [
                        {
                            model: User,
                            as: "author",
                            attributes: ["id", "username"]
                        },
                        {
                            model: CommunityReply,
                            as: "replies",
                            include: [
                                {
                                    model: User,
                                    as: "author",
                                    attributes: ["id", "username"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        const posts = likedPosts.map(like => like.post).filter(post => post);

        res.json({
            message: "Daftar post yang Anda like",
            posts
        });
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil post yang disukai",
            error: error.message
        });
    }
};

exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.session.userId; // ambil userId dari session

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const posts = await CommunityPost.findAll({
      where: { userId },
      include: [
        {
          model: Community,
          as: "community", // pastikan alias ini sama dengan yang didefinisikan di asosiasi model
          attributes: ["id", "name", "description"] // sesuaikan field yang ingin ditampilkan
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's posts", error });
  }
};
