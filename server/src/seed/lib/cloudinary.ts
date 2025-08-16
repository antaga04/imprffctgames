import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

let isConfigured = false;
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });
    isConfigured = true;
}

export async function uploadPokemonImage(imageUrl: string, grayscale = false): Promise<string> {
    if (!isConfigured) throw new Error('Cloudinary not configured');

    const publicId = uuidv4();
    const transformation = grayscale ? [{ effect: 'grayscale' }] : [];

    const res = await cloudinary.uploader.upload(imageUrl, {
        folder: 'imprffctgames/pokemons',
        public_id: publicId,
        transformation,
    });

    return res.secure_url;
}

export function cloudinaryIsConfigured() {
    return isConfigured;
}
