"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const deleteFile_1 = __importDefault(require("../../utils/fileManagement/deleteFile"));
const queryCollection_1 = require("../../lib/dbQuery/queryCollection");
const upload_config_1 = require("../../utils/fileManagement/upload.config");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = 'SELECT COUNT(email) FROM `user_info`';
    try {
        const userResult = yield queryCollection_1.Query.Paginate('users', 1, 4);
        res.status(200).json({
            success: true,
            message: 'User info fetched successfully',
            users: userResult
        });
    }
    catch (err) {
        next(err);
    }
});
/**
 * JWT GENERATE TOKEN WHEN SIGN IN USER
 * -------------------------------------
 * When user will sign in, then jwt token will be generated
 * */
const signInUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    // const password = req.body.password;
    const user = email;
    /**
     * You can check the user email and password Here ;
     * If successful user, then sign token and login successful else Unauthorized user,Invalid Login
     * */
    // Sign in jwt token
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const token = jsonwebtoken_1.default.sign({ user }, `${accessTokenSecret}`, {
        expiresIn: '1h'
    });
    res.status(200).json({
        success: true,
        user: user,
        token: token
    });
});
// File Uploading
const fileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload_config_1.fileUpload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            const uploadedFile = req.file;
            // const other = req.body.name;
            // console.log(other)
            // Respond with the uploaded file in the response
            res.status(200).json({
                message: 'Photo uploaded successfully',
                file: uploadedFile,
                photoURL: `${req.protocol}://${req.get('host')}/` + (uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.path.replace(/\\/g, "/")) //use protocol `https://` use extra s
            });
        });
    }
    catch (error) {
        console.error('Error in userPhoto controller:', error);
        res.status(500).send('Internal Server Error');
    }
});
// File Deleting
const deleteFileData = (req, res) => {
    const directoryPath = 'uploads/documents'; // Pass the directory path here
    const fileName = req.params.filename; // Pass the file name here
    (0, deleteFile_1.default)(directoryPath, fileName, (error, message) => {
        if (error) {
            res.status(404).send({ message: error.message });
        }
        else {
            res.status(200).send({ message: message }); // File deletion successful
        }
    });
};
// These are accessible from different files.
exports.userController = {
    createUser,
    getUsers,
    signInUser,
    fileUpload,
    deleteFileData,
};
