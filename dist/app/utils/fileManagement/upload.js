"use strict";
// import multer from 'multer'
// import path from 'path'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/')
//     },
//     filename: (req, file, cb) => {
//         const fileExt = path.extname(file.originalname)
//         const filename = file.originalname
//             .replace(fileExt, "")
//             .toLowerCase()
//             .split(" ")
//             .join("-") + "-" + Date.now()
//         cb(null, filename + fileExt)
//     }
// })
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1000000 //1 MB
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.fieldname === 'photo') {
//             if (
//                 file.mimetype === 'image/jpeg' ||
//                 file.mimetype === 'image/png' ||
//                 file.mimetype === 'image/jpg'
//             ) {
//                 cb(null, true)
//             }
//             else {
//                 cb(new Error("Only jpg,jpeg or png is allowed"))
//             }
//         }
//         // For pdf
//         // else if (file.fieldname === 'doc') {
//         //     if (
//         //         file.mimetype === 'application/pdf'
//         //     ) {
//         //         cb(null, true)
//         //     }
//         //     else {
//         //         cb(new Error("Only .pdf is allowed"))
//         //     }
//         // }
//         else {
//             cb(new Error("There was unknown error"))
//         }
//     },
// })
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
/**
 * CONFIGURING THE CONTROLLER WITH
 * PHOTO UPLOAD
 * PDF UPLOAD
 * VIDEO UPLOAD
 * DOC UPLOAD
 * */
// photo upload config:
// const photoUpload = configureMulter(
//     'photo',
//     ['image/jpeg', 'image/png', 'image/jpg'],
//     './uploads/photos/',
//     'photo',
//     1000000 // 1 MB
// );
