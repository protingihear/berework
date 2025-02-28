const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Nama room
    participants: [{ type: String, ref: "ChatUser" }], // Samakan tipe dengan userId di ChatUser
    isGroup: { type: Boolean, default: false },
}, { timestamps: true });

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
