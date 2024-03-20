"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const configureMulter = (fieldName, allowedMimeTypes, destinationPath, filenamePrefix, fileSizeLimit) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const fileExt = path_1.default.extname(file.originalname);
            const filename = file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') + '-' + Date.now();
            cb(null, filename + fileExt);
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.fieldname === fieldName) {
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error(`Only ${allowedMimeTypes} is allowed`));
            }
        }
        else {
            cb(new Error('There was an unknown error'));
        }
    };
    return (0, multer_1.default)({
        storage: storage,
        limits: {
            fileSize: fileSizeLimit
        },
        fileFilter: fileFilter
    });
};
exports.default = configureMulter;
