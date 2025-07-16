import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
} catch (error) {
    console.error('Cloudinary config error: ', error);
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: () => ({
        folder: 'puzlynk',
        allowed_formats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    }),
});

const uploadFile = multer({ storage });

//! Create delete file

export default uploadFile;
