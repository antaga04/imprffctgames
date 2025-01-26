import CryptoJS from 'crypto-js';

export const decryptData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTO_SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        console.error('[decryptData] Error:', error);
        throw new Error('Invalid or corrupted data');
    }
};
