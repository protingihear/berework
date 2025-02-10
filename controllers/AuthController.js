const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, role } = req.body;
        const user = await User.create({ firstname, lastname, email, username, password, role });
        res.status(201).json({ message: 'User registered', user });
	console.log("hasil"+firstname);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });

    }
};

exports.login = async (req, res) => {
  try {
        const { username, password } = req.body;
        console.log("Login request received for:", username);
        
        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Incorrect password");
            return res.status(401).json({ message: "Incorrect password" });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        
        // Debugging: Cek apakah session tersimpan
        console.log("Session after login:", req.session);
        console.log("Cookies sent:", req.header.cookie);

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
