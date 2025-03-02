const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    senderId: { type: String, required: true }, // Sesuai dengan userId dari MySQL

    username: { type: String, required: true }, // Sesuai dengan userId dari MySQL
    message: { type: String, required: true },
    messageType: { type: String, enum: ["text", "image", "video"], default: "text" },
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
