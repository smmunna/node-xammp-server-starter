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
const deleteFastFile_1 = __importDefault(require("../../lib/file/deleteFastFile"));
const password_hash_1 = __importDefault(require("password-hash"));
const photoPath_1 = __importDefault(require("../../lib/file/photoPath"));
const sendApiResponse_1 = __importDefault(require("../../lib/ApiResponse/sendApiResponse"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload_config_1.photoUpload.single('photo')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (err) {
                console.error('Error uploading photo:', err);
                return next(err);
            }
            // Access form data and uploaded file
            const { name, password, email } = req.body;
            const photoPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const photoURL = `${req.protocol}://${req.get('host')}/` + (photoPath === null || photoPath === void 0 ? void 0 : photoPath.replace(/\\/g, "/"));
            const hashedPassword = password_hash_1.default.generate(password);
            const existingUser = yield queryCollection_1.Query.selectOne('users', 'email', email);
            if (existingUser) {
                (0, deleteFastFile_1.default)(photoPath);
                return res.status(400).send({
                    success: false,
                    message: 'User already exists'
                });
            }
            // Check for missing or empty fields
            if (!name || !password || !email || !photoPath) {
                // Delete the file if it exists
                if (photoPath) {
                    (0, deleteFastFile_1.default)(photoPath);
                }
                return res.status(400).send({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }
            const query = `INSERT INTO users (name, email, password, image) VALUES ('${name}', '${email}', '${hashedPassword}', '${photoURL}')`;
            try {
                // Assuming you're using a database library like knex.js or mysql2
                // Here, 'executeQuery' is just a placeholder for your database library's method to execute the query
                const result = yield queryCollection_1.Query.executeQuery(query);
                // If all fields are provided, respond with success message
                if (result) {
                    res.status(200).send({
                        success: true,
                        message: 'User created successfully',
                        userdata: result
                    });
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: 'User creation failed'
                    });
                }
            }
            catch (error) {
                console.error('Error executing query:', error);
                next(error);
            }
        }));
    }
    catch (error) {
        console.error('Error in createUser controller:', error);
        next(error);
    }
});
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = 'SELECT * FROM `users`';
    try {
        const userResult = yield queryCollection_1.Query.executeQuery(userQuery);
        (0, sendApiResponse_1.default)(res, 200, true, 'User fetched successfully', userResult);
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
// Update User -with Form data
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload_config_1.photoUpload.single('photo')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error uploading photo:', err);
                return next(err);
            }
            const { name, password, email, role } = req.body;
            let photoURL = ''; // Initialize photoURL variable
            // Check if photo was uploaded
            if (req.file) {
                // Construct photo URL
                photoURL = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
            }
            // Get existing user data
            const user = yield queryCollection_1.Query.selectOneWithColumn('users', ['name', 'email', 'password', 'image'], 'email', email);
            // If user exists and photo is provided, delete old photo
            if (user && req.file && user.image) {
                (0, deleteFastFile_1.default)((0, photoPath_1.default)(user.image));
            }
            // Construct update query
            let query = `UPDATE users SET`;
            const updateFields = []; // Initialize an array to store update fields
            if (name !== undefined && name !== null) {
                updateFields.push(`name = '${name}'`);
            }
            if (password) {
                updateFields.push(`password = '${password_hash_1.default.generate(password)}'`);
            }
            if (role !== undefined && role !== null) {
                updateFields.push(`role = '${role}'`);
            }
            if (photoURL) {
                updateFields.push(`image = '${photoURL}'`);
            }
            // Add update fields to the query
            query += ' ' + updateFields.join(', '); // Join update fields with ', '
            query += ` WHERE email = '${email}'`;
            // Execute update query
            const result = yield queryCollection_1.Query.executeQuery(query);
            if (result) {
                // Success response
                res.status(200).send({
                    success: true,
                    message: 'User updated successfully',
                    updated: result
                });
            }
            else {
                // Error response
                res.status(400).send({
                    success: false,
                    message: 'User update failed'
                });
            }
        }));
    }
    catch (error) {
        next(error);
    }
});
// Delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        // Validate ID to prevent SQL injection
        if (!/^\d+$/.test(id)) {
            throw new Error("Invalid ID");
        }
        // User Existance
        const userExistance = yield queryCollection_1.Query.selectOne('users', 'id', id);
        if (!userExistance) {
            res.status(404).send({
                success: false,
                message: "User does not exist",
            });
        }
        else {
            const user = yield queryCollection_1.Query.executeQuery(`SELECT image FROM users WHERE id ='${id}'`);
            const path = (0, photoPath_1.default)(user[0].image); //Old image URL
            const query = `DELETE FROM users WHERE id = ${id}`;
            const result = yield queryCollection_1.Query.executeQuery(query);
            if (result) {
                res.status(200).send({
                    success: true,
                    message: 'User deleted successfully',
                    deleted: result
                });
                (0, deleteFastFile_1.default)(path);
            }
            else {
                res.status(400).send({
                    success: false,
                    message: 'User deletion failed'
                });
            }
        }
    }
    catch (error) {
        next(error);
    }
});
// These are accessible from different files.
exports.userController = {
    createUser,
    getUsers,
    signInUser,
    fileUpload,
    deleteFileData,
    updateUser,
    deleteUser
};
