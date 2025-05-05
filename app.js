const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./config/database");

require("dotenv").config();
const connectMongoDB = require("./config/monggoDB");
const MySQLStore = require("express-mysql-session")(session);

// Inisialisasi MongoDB (jika tidak ingin di-test, bisa dipindah ke server.js)
connectMongoDB();

const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");
const kategoriRoutes = require("./routes/categoryRoutes");
const beritaRoutes = require("./routes/beritaRoutes");
const communityRoutes = require("./routes/communityRoutes");
const chatRoutes = require("./routes/chat/chatRoutes");

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:50498", "https://berework-production.up.railway.app", "berework-production-1c3d.up.railway.app","http://10.0.2.2"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Konfigurasi sesi
const dbOptions = {
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQL_DATABASE || "your_database",
};
const sessionStore = new MySQLStore(dbOptions);
app.use(session({
    key: "tt",
    secret: "tt",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

// Routes
app.use("/auth", AuthRoutes);
app.use("/api", UserRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/", kategoriRoutes);
app.use("/", communityRoutes);
app.use("/", chatRoutes);

module.exports = app; // ⚠️ Penting agar supertest bisa pakai ini
