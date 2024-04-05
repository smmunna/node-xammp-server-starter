import { Response } from 'express';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: number;
        message: string;
    };
    pagination?: {
        total: number;
        pageSize: number;
        currentPage: number;
    };
}


const sendApiResponse = <T>(res: Response, statusCode: number, success: boolean, message: string, data?: any) => {
    const response: ApiResponse<T> = {
        success,
        message,
        data
    };
    return res.status(statusCode).json(response);
};

export default sendApiResponse;
