import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gameshub',
        allowFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    },
});

const uploadFile = multer({ storage });

//! Create delete file

export default uploadFile;
