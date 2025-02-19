const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        console.log("Session Data:", req.session);

        if (!req.session.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findByPk(req.session.userId, {
            attributes: ["id", "firstname", "lastname", "email", "username", "role"],
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

const bcrypt = require("bcrypt");

exports.updateUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { firstname, lastname, email, password } = req.body;

        // Object to store fields that need to be updated
        const updateFields = { firstname, lastname, email };

        // Only hash and update password if provided
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        // Update only the provided fields
        await User.update(updateFields, { where: { id: req.session.userId } });

        res.json({ message: "Profile updated" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        await User.destroy({ where: { id: req.session.userId } });
        req.session.destroy();
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie('tt');
        res.json({ message: "Logged out successfully" });
    });
};
