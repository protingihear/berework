const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
    name: { type: String, required: true },  
    username: { type: String, required: true },  
    participants: [{ type: String, ref: "ChatUser" }],  // HARUS String, bukan ObjectId
    isGroup: { type: Boolean, default: false },
}, { timestamps: true });

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
