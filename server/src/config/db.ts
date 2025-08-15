import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log('$ Connected to DB.\n');
    } catch (error) {
        console.error('$ Error connecting to DB.', error);
        process.exit(1);
    }
};
