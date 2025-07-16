import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

export const verifyPassword = async (password: string, hash: string) => {
    const validPass = await bcrypt.compare(password, hash);
    return validPass;
};
