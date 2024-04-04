"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const deleteFastFile = (path) => {
    fs_1.default.unlink(path, (err) => {
        if (err) {
            console.error('Error instant deleting file:', err);
        }
        console.log('');
    });
};
exports.default = deleteFastFile;
