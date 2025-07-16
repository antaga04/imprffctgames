import mongoose from 'mongoose';

const guestSessionSchema = new mongoose.Schema({
    fingerprint: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '24h' },
});

export default mongoose.model('GuestSession', guestSessionSchema);
