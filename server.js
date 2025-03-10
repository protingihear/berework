const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const http = require("http");
const { Server } = require("socket.io");

const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");
const kategoriRoutes = require("./routes/categoryRoutes");
const beritaRoutes = require("./routes/beritaRoutes");
const communityRoutes = require("./routes/communityRoutes");
const chatRoutes = require("./routes/chat/chatRoutes"); // Tambahkan route chat

require("dotenv").config();
const connectMongoDB = require("./config/monggoDB");
const MySQLStore = require("express-mysql-session")(session);
const PORT = process.env.PORT || 5000;
//cek autodeploy
// Koneksi ke MongoDB (untuk chat)
connectMongoDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:59213", "https://berework-production.up.railway.app", "http://10.0.2.2"],
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:50498", "https://berework-production.up.railway.app", "http://10.0.2.2"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Konfigurasi sesi untuk MySQL
const dbOptions = {
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQL_DATABASE || "your_database",
};
const sessionStore = new MySQLStore(dbOptions);
app.use(
    session({
        key: "tt",
        secret: "tt", // Replace with a strong secret key
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to false for localhost
            httpOnly: false,
            sameSite: "lax", // Allows cross-origin cookies in most cases
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

// Routes
app.use("/auth", AuthRoutes);
app.use("/api", UserRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/", kategoriRoutes);
app.use("/", communityRoutes);
app.use("/", chatRoutes); // Tambahkan route chat

// Koneksi ke database MySQL dengan Sequelize
sequelize.sync({ alter: true }).then(() => {
    console.log("Database siap");
});

// 🔹 WebSocket untuk Chat
io.on("connection", (socket) => {
    console.log(`User ${socket.id} terhubung`);

    // Bergabung ke chat room tertentu
    socket.on("joinRoom", ({ userId, roomId }) => {
        socket.join(roomId);
        console.log(`User ${userId} bergabung ke room ${roomId}`);
    });

    // Menerima pesan dan broadcast ke room terkait
    socket.on("sendMessage", async (data) => {
        const { chatRoomId, sender, content } = data;

        // Simpan pesan ke database MongoDB
        const newMessage = new Message({ chatRoomId, sender, content });
        await newMessage.save();

        // Kirim ke semua user di room tersebutaaa
        io.to(chatRoomId).emit("receiveMessage", newMessage);
    });

    // Event saat user disconnect
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} terputus`);
    });
});

// Jalankan server dengan WebSocket
server.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
