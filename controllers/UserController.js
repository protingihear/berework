const User = require('../models/user');
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
    try {
        if (!req.session.userId || !req.cookies.session_id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const users = await User.findAll({
            attributes: ["id", "firstname", "lastname", "email", "username", "role", "bio", "gender", "Image"]
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        console.log("Session Data:", req.session);
        console.log("Cookies:", req.cookies);

        if (!req.session.userId || !req.cookies.session_id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findByPk(req.session.userId, {
            attributes: ["id", "firstname", "lastname", "email", "username", "role", "bio", "gender", "Image"]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Convert Base64 to Data URL
        const imageBase64 = user.Image ? `data:image/png;base64,${user.Image}` : null;

        res.json({
            ...user.toJSON(),
            picture: imageBase64, // Change 'Image' to 'picture' with proper format
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

// ✅ FUNGSI UPDATE USER LENGKAP YANG SUDAH DIPERBAIKI
exports.updateUser = async (req, res) => {
    try {
        // 1. Validasi Autentikasi
        const sessionUserId = req.session.userId;
        if (!sessionUserId) {
            return res.status(401).json({ message: "Tidak terautentikasi" });
        }

        // 2. Cari User di Database
        const user = await User.findByPk(sessionUserId);
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        // 3. Siapkan Data dari Request untuk Pembaruan Parsial
        const { firstname, lastname, email, username, password, role, bio, gender } = req.body;
        const updateFields = {};

        // 4. Kumpulkan Field Teks yang Ingin Di-update (jika disediakan)
        if (firstname !== undefined) updateFields.firstname = firstname;
        if (lastname !== undefined) updateFields.lastname = lastname;
        if (email !== undefined) updateFields.email = email;
        if (username !== undefined) updateFields.username = username;
        if (role !== undefined) updateFields.role = role;
        if (bio !== undefined) updateFields.bio = bio;
        if (gender !== undefined) updateFields.gender = gender;

        // 5. Tangani Field File: 'Image' dan 'sertif' (keduanya dari req.files)
        // Untuk 'Image': Multer menyediakannya di req.files['Image']
        if (req.files && req.files['Image']) {
            updateFields.Image = req.files['Image'][0].buffer.toString("base64");
        } else if (req.body.Image === "") { // Jika client mengirim string kosong, set null
            updateFields.Image = null;
        }
        // Jika tidak ada file 'Image' baru diupload DAN req.body.Image bukan string kosong,
        // maka field 'Image' di database tidak akan diubah.

        // Untuk 'sertif': Multer menyediakannya di req.files['sertif']
        if (req.files && req.files['sertif']) {
            updateFields.sertif = req.files['sertif'][0].buffer.toString("base64");
        } else if (req.body.sertif === "") { // Jika client mengirim string kosong, set null
            updateFields.sertif = null;
        }
        // Jika tidak ada file 'sertif' baru diupload DAN req.body.sertif bukan string kosong,
        // maka field 'sertif' di database tidak akan diubah.

        // 6. Tangani Pembaruan Kata Sandi
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({ message: "Kata sandi minimal 6 karakter" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                updateFields.password = await bcrypt.hash(password, 10);
            }
        }

        // 7. Cek Jika Tidak Ada Perubahan Sama Sekali
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "Tidak ada perubahan yang dibuat" });
        }

        // 8. Lakukan Update ke Database
        await User.update(updateFields, { where: { id: sessionUserId } });
        return res.json({ message: "Profil berhasil diperbarui" });

    } catch (error) {
        console.error("Error memperbarui profil:", error);
        return res.status(500).json({ message: "Error memperbarui profil", error: error.message });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        if (!req.session.userId || !req.cookies.session_id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        await User.destroy({ where: { id: req.session.userId } });
        req.session.destroy();
        res.clearCookie("session_id");
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });

        res.clearCookie("session_id");
        res.json({ message: "Logged out successfully" });
    });

};
exports.activateUser = async (req, res) => {
    try {
        if (!req.session.userId || !req.cookies.session_id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.akunaktif) {
            return res.status(400).json({ message: "User is already active" });
        }

        await User.update({ akunaktif: true }, { where: { username } });

        res.json({ message: `User ${username} has been activated successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error activating user", error: error.message });
    }
};

