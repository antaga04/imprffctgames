import { Response } from 'express';
import { ApiError, ApiSuccess } from '@/types';

export function sendSuccess<T>(
    res: Response,
    status: number,
    partial: Omit<ApiSuccess<T>, 'success'>,
): Response<ApiSuccess<T>> {
    return res.status(status).json({
        success: true,
        ...partial,
    });
}

export function sendError<T>(
    res: Response,
    status: number,
    partial: Omit<ApiError<T>, 'success'>,
): Response<ApiError<T>> {
    return res.status(status).json({
        success: false,
        ...partial,
    });
}
