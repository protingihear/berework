const mongoose = require("mongoose");  
const ChatRoom = require("../../models/chat/ChatRoom");
const Message = require("../../models/chat/Message");
const User = require("../../models/chat/User");
// ✅ Buat Ruang Chat
exports.createRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const username=req.user.username
        const userId = req.user.id; // ID user dari sesi atau token

        // Buat room dengan user pembuat sebagai participant pertama
        const chatRoom = new ChatRoom({
            name,
            username,
            participants: [userId] // Simpan sebagai String
        });

        await chatRoom.save();
        res.status(201).json({ message: "Chat room created", chatRoom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Bergabung ke Chat Room
exports.joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;
        const username = req.user.username;

        // Cek apakah ID room valid
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid room ID" });
        }

        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ error: "Chat room not found" });
        }

        // Periksa apakah user sudah menjadi peserta
        if (chatRoom.participants.includes(userId)) {
            return res.status(400).json({ error: "User already joined this room" });
        }

        // Update username jika belum ada
        if (!chatRoom.username) {
            chatRoom.username = username;
        }

        // Tambahkan user ke participants
        chatRoom.participants.push(userId);
        await chatRoom.save();

        res.status(200).json({ message: "Joined room successfully", chatRoom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ Ambil semua ruang obrolan user
// ✅ Ambil semua pengguna dalam suatu chat room
exports.getRoomUsers = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Pastikan room ID valid
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid room ID" });
        }

        // Cari chat room berdasarkan ID
        const chatRoom = await ChatRoom.findById(roomId).populate("participants", "username email"); // Ambil username & email peserta

        if (!chatRoom) {
            return res.status(404).json({ error: "Chat room not found" });
        }

        res.status(200).json({ participants: chatRoom.participants });
    } catch (error) {
        console.error("❌ Error saat mengambil pengguna dalam chat room:", error);
        res.status(500).json({ error: "Gagal mengambil pengguna", details: error.message });
    }
};


// ✅ Kirim pesan dalam ruang obrolan
exports.sendMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { message, messageType } = req.body;
        const senderId = req.user.id;
        const username=req.user.username
        console.log(username+"sini")

        // Cek apakah room ada
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ error: "Chat room not found" });
        }

        // Cek apakah user adalah peserta room
        if (!chatRoom.participants.includes(senderId)) {
            return res.status(403).json({ error: "User is not a participant of this chat room" });
        }

        // Simpan pesan ke database
        const newMessage = new Message({
            chatRoomId: roomId,
            senderId,
            username,

            message,
            messageType
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengirim pesan" });
    }
};

// ✅ Ambil pesan dari suatu ruang obrolan
exports.getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id; // Ambil user ID dari sesi/token

        // 🔍 Debugging log
        console.log(`Fetching messages for Room ID: ${roomId}, User: ${userId}`);

        // Pastikan room ID valid
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid room ID" });
        }

        // Cek apakah room ada
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ error: "Chat room not found" });
        }

        // Cek apakah user adalah peserta dalam room
        if (!chatRoom.participants.includes(userId)) {
            return res.status(403).json({ error: "You are not a participant in this chat room" });
        }

        // Ambil pesan dengan informasi pengirim
        const messages = await Message.find({ chatRoomId: roomId })
            .populate("senderId", "username") // Ambil username dari sender
            .sort({ createdAt: 1 }); // Urutkan dari yang paling lama ke baru

        res.status(200).json(messages);
    } catch (error) {
        console.error("❌ Error saat mengambil pesan:", error);
        res.status(500).json({ error: "Gagal mengambil pesan", details: error.message });
    }
};
