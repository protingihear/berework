const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, role, bio, gender } = req.body;

        const Image = req.file ? req.file.buffer.toString("base64") : null;
        const sertif = req.file ? req.file.buffer.toString("base64") : null;
        const akunaktif = role === 'admin' ? false : true;

        const user = await User.create({ firstname, lastname, email, username, password, bio, role, gender, Image, sertif, akunaktif });

        res.status(201).json({ message: 'User registered', user });

    } catch (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "Ukuran file terlalu besar! Maksimum 2MB." });
        }

        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect password" });

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.cookie("session_id", req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Session Check
exports.getSession = (req, res) => {
    res.json({ 
        session: req.session,
        cookies: req.cookies 
    });
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fajarmufid01@gmail.com',
        pass: 'zbinvsbwcqacuzhc',
    }
});

// Forgot Password (send email)
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Email tidak ditemukan" });

        const token = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '15m' });
        const resetLink = `https://berework-production-ad0a.up.railway.app/auth/reset-password?token=${token}`;

        await transporter.sendMail({
            from: 'fajarmufid01@gmail.com',
            to: email,
            subject: 'Reset Password',
            html: `<p>Klik link berikut untuk mereset password Anda:</p><a href="${resetLink}">${resetLink}</a>`,
        });

        res.json({ message: "Link reset password telah dikirim ke email." });

    } catch (error) {
        res.status(500).json({ message: "Gagal mengirim link reset password" });
    }
};

// Reset Password - tampilkan form
exports.showResetPasswordForm = (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(400).send("Token tidak ditemukan");

    res.send(`
        <html>
        <head>
            <title>Reset Password</title>
            <style>
                body { font-family: Arial; padding: 50px; }
                form { max-width: 300px; margin: auto; }
                input { width: 100%; padding: 10px; margin: 8px 0; }
                button { padding: 10px; width: 100%; background-color: #007bff; color: white; border: none; }
            </style>
        </head>
        <body>
            <h2>Reset Password</h2>
            <form method="POST" action="/auth/reset-password">
                <input type="hidden" name="token" value="${token}" />
                <label>Password baru:</label><br/>
                <input type="password" name="newPassword" required /><br/><br/>
                <button type="submit">Reset Password</button>
            </form>
        </body>
        </html>
    `);
};

// Reset Password - proses kirim password baru
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.send("Password berhasil direset. Silakan login kembali.");
    } catch (error) {
        res.status(400).send("Token tidak valid atau kadaluarsa");
    }
};