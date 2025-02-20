const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
        try {
        const { firstname, lastname, email, username, password, role, bio, gender } = req.body;

        // Jika file gambar ada, konversi ke base64, jika tidak, biarkan null
        const Image = req.file ? req.file.buffer.toString("base64") : null;

        const user = await User.create({ firstname, lastname, email, username, password, bio, role, gender, Image });

        res.status(201).json({ message: 'User registered', user });

    } catch (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "Ukuran file terlalu besar! Maksimum 2MB." });
        }

        res.status(500).json({ message: 'Error registering user', error: error.message });
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
        
        // Debugging
        // console.log("Raw Cookie Header:", req.headers.cookie);
        // console.log("Session after login:", req.session);
        console.log("Cookies after login:", req.cookies);  // Cek cookies
        console.log("Request headers (contains cookies?):", req.get("Cookie")); // Cek cookies dari request
        console.log(req.session);
        // console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]); 

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie('tt');
        res.json({ message: "Logged out successfully" });
    });
};


exports.getSession = (req, res) => {
    console.log("Session Check:", req.session);
    console.log("Cookies:", req.cookies);

    res.json({ 
        session: req.session,
        cookies: req.cookies 
    });
};

