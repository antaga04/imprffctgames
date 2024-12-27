import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: 60 * 60 });
    return token;
};

export const verifytoken = (token) => {
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    return payload;
};
