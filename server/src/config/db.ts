import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
    try {
        mongoose
            .connect(process.env.MONGO_URL!)
            .then(() => {
                console.log('$ Connected to DB.\n');
            })
            .catch((err) => {
                console.error('$ Error connecting to DB.', err);
                process.exit(1);
            });
    } catch (error) {
        console.error('Error connecting to DB:', error);
        process.exit(1);
    }
};
