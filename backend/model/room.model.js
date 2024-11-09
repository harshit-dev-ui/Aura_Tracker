import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    timer: { type: Number, default: 1500 },
    isRunning: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
});

const Room = mongoose.model("Room",roomSchema);
export default Room;