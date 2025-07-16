import { Request } from 'express';
type TokenPayload = {
    id: string;
};

interface AuthenticatedRequest extends Request {
    user: TokenPayload;
}

//! Example: Extend Express Request

declare module 'express' {
    interface Request {
        user?: {
            id: string;
        };
    }

    /*  interface Response {
		statusCode?: number;
		error: string;
		message: string;
		data?: any;
	} */
}
