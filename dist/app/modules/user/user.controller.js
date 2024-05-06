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
const queryCollection_1 = require("../../lib/dbQuery/queryCollection");
const upload_config_1 = require("../../utils/fileManagement/upload.config");
const deleteFastFile_1 = __importDefault(require("../../lib/file/deleteFastFile"));
const password_hash_1 = __importDefault(require("password-hash"));
const photoPath_1 = __importDefault(require("../../lib/file/photoPath"));
const sendApiResponse_1 = __importDefault(require("../../lib/ApiResponse/sendApiResponse"));
// Create user
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Photo upload middleware
        upload_config_1.photoUpload.single('photo')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (err) {
                console.error('Error uploading photo:', err);
                return next(err);
            }
            // Access form data and uploaded file
            const { username, password, email, phone, user_id, dept_id, role, } = req.body;
            const photoPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const photoURL = `${req.protocol}://${req.get('host')}/` + (photoPath === null || photoPath === void 0 ? void 0 : photoPath.replace(/\\/g, "/"));
            const hashedPassword = password_hash_1.default.generate(password);
            const existingUser = yield queryCollection_1.Query.selectOne('users', 'email', email);
            if (existingUser) {
                (0, deleteFastFile_1.default)(photoPath);
                return (0, sendApiResponse_1.default)(res, 400, false, 'User already exists', existingUser);
            }
            // Check for missing or empty fields
            if (!username || !password || !email || !photoPath || !user_id || !dept_id) {
                // Delete the file if it exists
                if (photoPath) {
                    (0, deleteFastFile_1.default)(photoPath);
                }
                return (0, sendApiResponse_1.default)(res, 400, false, 'Please provide all required fields');
            }
            const query = `
                INSERT INTO users (
                    username, password, email, phone, photo, dept_id, user_id, role
                ) 
                VALUES (
                    '${username}', '${hashedPassword}', '${email}', '${phone}', 
                    '${photoURL}', '${dept_id}', '${user_id}','${role}'
                )
            `;
            try {
                const result = yield queryCollection_1.Query.executeQuery(query);
                if (result) {
                    (0, sendApiResponse_1.default)(res, 200, true, 'User created successfully', result);
                }
                else {
                    (0, sendApiResponse_1.default)(res, 400, false, 'User creation failed');
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
// Getting a single user
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        // Execute the query
        const userResult = yield queryCollection_1.Query.selectOne('users', 'id', id, ['username', 'email', 'phone', 'photo']);
        // Respond with the fetched user information
        (0, sendApiResponse_1.default)(res, 200, true, 'User fetched successfully', userResult);
    }
    catch (err) {
        next(err);
    }
});
// Perfect Update user TODO: Update user
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Handle photo upload
        upload_config_1.photoUpload.single('photo')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error uploading photo:', err);
                return next(err);
            }
            const { username, password, email, phone, photo, dept_id, user_id, role, } = req.body;
            let photoURL = '';
            if (req.file) {
                photoURL = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
            }
            const user = yield queryCollection_1.Query.selectOneWithColumn('users', ['username', 'password', 'photo', 'email'], 'email', email);
            if (user && req.file && user.photo) {
                (0, deleteFastFile_1.default)((0, photoPath_1.default)(user.photo));
            }
            let query = `UPDATE users SET username = '${username}', email = '${email}'`;
            if (password) {
                query += `, password = '${password_hash_1.default.generate(password)}'`;
            }
            if (user_id) {
                query += `, user_id = '${user_id}'`;
            }
            if (phone) {
                query += `, phone = '${phone}'`;
            }
            if (dept_id) {
                query += `, dept_id = '${dept_id}'`;
            }
            if (role) {
                query += `, role = '${role}'`;
            }
            if (photoURL) {
                query += `, photo = '${photoURL}'`;
            }
            query += ` WHERE email = '${email}'`;
            const result = yield queryCollection_1.Query.executeQuery(query);
            if (result) {
                res.status(200).send({
                    success: true,
                    message: 'User updated successfully',
                    updated: result
                });
            }
            else {
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
        const user = yield queryCollection_1.Query.executeQuery(`SELECT photo FROM users WHERE user_id ='${id}'`);
        const path = (0, photoPath_1.default)(user[0].photo); //Old photo URL
        const query = `DELETE FROM users WHERE user_id = ${id}`;
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
    catch (error) {
        next(error);
    }
});
// User sign in
const signInUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        // const query = `SELECT username,email,password FROM users WHERE email='${email}'`
        const user = yield queryCollection_1.Query.selectOne('users', 'email', email);
        if (!user) {
            return res.status(403).send({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const isPasswordValid = password_hash_1.default.verify(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).send({
                success: false,
                message: 'Invalid email or password'
            });
        }
        if (isPasswordValid && user) {
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
        }
        else {
            res.status(403).send({
                success: false,
                message: 'Invalid username or password'
            });
        }
    }
    catch (error) {
        res.status(403).send({
            success: false,
            message: 'Invalid username or password'
        });
    }
});
// These are accessible from different files.
exports.userController = {
    createUser,
    getSingleUser,
    updateUser,
    deleteUser,
    signInUser,
};
