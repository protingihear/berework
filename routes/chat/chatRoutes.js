const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chat/chatController");
const authMiddleware = require("../../middleware/authMiddleware"); // Gunakan autentikasi dari backend yang sudah ada

// ✅ Buat ruang obrolan (wajib login)
//router.post("/rooms", authMiddleware, chatController.createRoom);

// ✅ Ambil semua ruang obrolan user (wajib login)
//router.get("/rooms", authMiddleware, chatController.getUserRooms);

// ✅ Kirim pesan dalam ruang obrolan (wajib login)
router.post("/api/chat/rooms/:roomId/messages", authMiddleware, chatController.sendMessage);

// ✅ Ambil semua pesan dari suatu ruang obrolan
//router.get("/rooms/:roomId/messages", authMiddleware, chatController.getMessages);





router.post("/api/chat/create-room", authMiddleware, chatController.createRoom); 
router.get("/api/:roomId/messages", authMiddleware, chatController.getMessages);
//router.get("/api/chat/room-users/:roomId", authMiddleware, chatController.getUserRooms); 
router.post("/api/chat/join-room/:roomId", authMiddleware, chatController.joinRoom); 
module.exports = router;
///api/chat/room-users/:roomId
