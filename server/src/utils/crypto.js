import CryptoJS from 'crypto-js';
import { createHmac } from 'crypto';

export function decryptData(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTO_SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        console.error('[decryptData] Error:', error);
        throw new Error('Invalid or corrupted data');
    }
}

export function generateBoardHash(data) {
    return createHmac('sha256', process.env.HASH_SECRET_KEY).update(JSON.stringify(data)).digest('hex');
}
