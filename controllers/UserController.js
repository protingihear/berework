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

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        if (!req.session.userId || !req.cookies.session_id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { firstname, lastname, email, password, bio, gender } = req.body;

        // Konversi gambar ke base64 jika ada file yang diunggah
        const Image = req.file ? req.file.buffer.toString("base64") : undefined;

        const updateFields = { firstname, lastname, email, bio, gender };

        if (Image) {
            updateFields.Image = Image;
        }

        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        await User.update(updateFields, { where: { id: req.session.userId } });

        res.json({ message: "Profile updated" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error });
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
