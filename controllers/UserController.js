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
        if (!req.session.userId || !req.cookies.session_id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Cek apakah user ada di database
        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { firstname, lastname, email, username, password, role, bio, gender } = req.body;
        const Image = req.file ? req.file.buffer.toString("base64") : (req.body.Image === "" ? null : undefined);

        
        
        // Siapkan updateFields hanya jika nilainya berubah
        const updateFields = {};
        if (firstname && firstname !== user.firstname) updateFields.firstname = firstname;
        if (lastname && lastname !== user.lastname) updateFields.lastname = lastname;
        if (email && email !== user.email) updateFields.email = email;
        if (username && username !== user.username) updateFields.username = username;
        if (bio && bio !== user.bio) updateFields.bio = bio;
        if (role && role !== user.role) updateFields.role = role;
        if (gender && gender !== user.gender) updateFields.gender = gender;
        if (Image !== undefined) {
            updateFields.Image = Image;
        }
        // Hash password jika ada dan berbeda
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            if (hashedPassword !== user.password) {
                updateFields.password = hashedPassword;
            }
        }

        // Jika tidak ada perubahan, kembalikan response
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No changes made" });
        }

        // Update user
        await User.update(updateFields, { where: { id: req.session.userId } });

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
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
