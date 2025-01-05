import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: '2h' });
    return token;
};

export const verifytoken = (token) => {
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    return payload;
};
