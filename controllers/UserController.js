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
            return res.status(401).json({ message: "Not authenticated" });
        }

        // 2. Cari User di Database
        const user = await User.findByPk(sessionUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Siapkan Data dari Request
        const { firstname, lastname, email, username, password, role, bio, gender } = req.body;
        const updateFields = {};

        // 4. Kumpulkan Field Teks yang Ingin Di-update
        if (firstname) updateFields.firstname = firstname;
        if (lastname) updateFields.lastname = lastname;
        if (email) updateFields.email = email;
        if (username) updateFields.username = username;
        if (role) updateFields.role = role;
        if (bio) updateFields.bio = bio;
        if (gender) updateFields.gender = gender;

        // 5. Kumpulkan Field File yang Di-update (Bagian yang Diperbaiki)
        if (req.files && req.files['Image']) {
            updateFields.Image = req.files['Image'][0].buffer.toString("base64");
        } else if (req.body.Image === "") {
            updateFields.Image = null;
        }

        if (req.files && req.files['sertif']) {
            updateFields.sertif = req.files['sertif'][0].buffer.toString("base64");
        } else if (req.body.sertif === "") {
            updateFields.sertif = null;
        }

        // 6. Handle Update Password
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                updateFields.password = await bcrypt.hash(password, 10);
            }
        }

        // 7. Cek Jika Tidak Ada Perubahan Sama Sekali
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No changes made" });
        }

        // 8. Lakukan Update ke Database
        await User.update(updateFields, { where: { id: sessionUserId } });
        return res.json({ message: "Profile updated successfully" });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Error updating profile", error: error.message });
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

