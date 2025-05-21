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

exports.updateUser = async (req, res) => {
    try {
        const sessionUserId = req.session.userId;
        const sessionCookie = req.cookies.session_id;

        // Validasi autentikasi
        if (!sessionUserId || !sessionCookie) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findByPk(sessionUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { firstname, lastname, email, username, password, role, bio, gender } = req.body;

        // Handle gambar dari req.file atau reset ("" berarti hapus gambar)
        let imageBase64;
        if (req.file) {
            imageBase64 = req.file.buffer.toString("base64");
        } else if (req.body.Image === "") {
            imageBase64 = null;
        }

        const updateFields = {};

        // Perbarui hanya jika ada perubahan
        if (firstname && firstname !== user.firstname) updateFields.firstname = firstname;
        if (lastname && lastname !== user.lastname) updateFields.lastname = lastname;
        if (email && email !== user.email) updateFields.email = email;
        if (username && username !== user.username) updateFields.username = username;
        if (role && role !== user.role) updateFields.role = role;
        if (bio && bio !== user.bio) updateFields.bio = bio;
        if (gender && gender !== user.gender) updateFields.gender = gender;
        if (imageBase64 !== undefined) updateFields.Image = imageBase64;

        // Handle password jika dikirim dan berbeda
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                updateFields.password = await bcrypt.hash(password, 10);
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No changes made" });
        }

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

