import { TokenPayload } from '@/types';
import jwt from 'jsonwebtoken';

export const signToken = (payload: TokenPayload): string => {
    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, { expiresIn: '2h' });
    return token;
};

export const verifytoken = (token: string): TokenPayload => {
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
    return payload as TokenPayload;
};
