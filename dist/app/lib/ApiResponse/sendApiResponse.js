"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendApiResponse = (res, statusCode, success, message, data) => {
    const response = {
        success,
        message,
        data
    };
    return res.status(statusCode).json(response);
};
exports.default = sendApiResponse;
