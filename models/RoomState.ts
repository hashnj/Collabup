// file: models/RoomState.ts
import mongoose from 'mongoose';

const RoomStateSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, default: '// Start typing...' },
  whiteboard: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.RoomState || mongoose.model('RoomState', RoomStateSchema);