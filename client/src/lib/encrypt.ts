import CryptoJS from 'crypto-js';

export const encryptData = (data: unknown) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_CRYPTO_SECRET_KEY).toString();
    return ciphertext;
};
