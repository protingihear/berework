const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, role, bio, gender } = req.body;

        // Validasi textfield wajib isi semua
        if (!firstname || !lastname || !email || !username || !password || !role || !bio || !gender) {
            return res.status(400).json({ message: 'Semua field harus diisi.' });
        }

        // Minimal kata "name" 4 digit
        if (firstname.length < 4) {
            return res.status(400).json({ message: 'Nama depan minimal 4 karakter.' });
        }
        if (lastname.length < 4) {
            return res.status(400).json({ message: 'Nama belakang minimal 4 karakter.' });
        }

        // Minimal username 4 digit
        if (username.length < 4) {
            return res.status(400).json({ message: 'Username minimal 4 karakter.' });
        }

        // Email harus menggunakan "@gmail.com"
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({ message: 'Email harus menggunakan domain @gmail.com.' });
        }

        // Password minimal 8 digit
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password minimal 8 karakter.' });
        }

        // Cek apakah firstname, username, email sudah digunakan
        const existingFirstName = await User.findOne({ where: { firstname } });
        if (existingFirstName) {
            return res.status(400).json({ message: `Nama depan "${firstname}" telah digunakan.` });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: `Username "${username}" telah digunakan.` });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: `Email "${email}" telah digunakan.` });
        }

        // Jika file gambar ada, konversi ke base64, jika tidak, biarkan null
        const Image = req.file ? req.file.buffer.toString("base64") : null;
        const sertif = req.file ? req.file.buffer.toString("base64") : null;

        // Jika role adalah 'admin', akunaktif = false, selain itu true
        const akunaktif = role === 'admin' ? false : true;

        // Hash password sebelum simpan
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ 
            firstname, 
            lastname, 
            email, 
            username, 
            password: hashedPassword, 
            bio, 
            role, 
            gender, 
            Image, 
            sertif, 
            akunaktif 
        });

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

        // Validasi input login wajib
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password harus diisi.' });
        }

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

        res.cookie("session_id", req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // gunakan HTTPS jika production
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24, // 1 hari
        });

        console.log("Session stored:", req.session);
        console.log("Cookies after login:", req.cookies);

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getSession = (req, res) => {
    console.log("Session Check:", req.session);
    console.log("Cookies:", req.cookies);

    res.json({ 
        session: req.session,
        cookies: req.cookies 
    });
};
