"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Delete a file with the specified file name from the specified directory.
 *
 * @param {string} directoryPath - 'uploads/files' The path of the directory where the file is located.
 * @param {string} fileName -'take it from params or query parameter' The name of the file to delete.
 * @param {Function} callback - The callback function to handle errors or success message.
 */
const deleteFile = (directoryPath, fileName, callback) => {
    const filePath = path_1.default.join(directoryPath, fileName);
    // Check if the file exists
    if (fs_1.default.existsSync(filePath)) {
        // Delete the file
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                callback(err, 'Failed to delete the file.');
            }
            else {
                callback(null, 'File deleted successfully.');
            }
        });
    }
    else {
        callback(new Error('File not found.'));
    }
};
exports.default = deleteFile;
