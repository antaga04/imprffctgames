import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';
import { FILE_SIZE_LIMIT, MB_FILE_SIZE_LIMIT } from '@/utils/constants';

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
    params: (req: any) => ({
        folder: `imprffctgames/${req.uploadFolder ?? ''}`, // Use custom folder or default
        public_id: `${req.uploadPrefix || 'file'}_${req.user?.id || 'user'}_${Date.now()}`,
        allowed_formats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }),
});

const upload = multer({
    storage,
    limits: {
        fileSize: FILE_SIZE_LIMIT,
    },
    fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Invalid file format. Only PNG, JPG, JPEG, GIF, and WebP are allowed.'));
        }
    },
});

// Factory function that returns middleware with error handling
const uploadFile = (fieldName: string, folder?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Set folder and prefix on request object for Cloudinary params
        if (folder) {
            req.uploadFolder = folder;
            req.uploadPrefix = fieldName;
        }

        upload.single(fieldName)(req, res, (error: any) => {
            if (error) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    return sendError(res, 400, {
                        i18n: 'user.file_too_large',
                        message: `File size too large. Maximum size allowed is ${MB_FILE_SIZE_LIMIT}MB.`,
                        errors: {
                            payload: error,
                        },
                    });
                }

                if (error.message.includes('Invalid file format')) {
                    return sendError(res, 400, {
                        i18n: 'user.invalid_file_type',
                        message: error.message,
                        errors: {
                            payload: error,
                        },
                    });
                }

                return sendError(res, 400, {
                    i18n: 'user.file_upload_failed',
                    message: 'File upload failed. Please try again.',
                    errors: {
                        payload: error,
                    },
                });
            }

            next();
        });
    };
};

export default uploadFile;
