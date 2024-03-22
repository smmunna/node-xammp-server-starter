"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post('/', user_controller_1.userController.createUser);
router.post('/login', user_controller_1.userController.signInUser);
router.get('/', user_controller_1.userController.getUsers);
// File Management Routes
router.post('/upload', user_controller_1.userController.fileUpload);
router.delete('/delete/:filename', user_controller_1.userController.deleteFileData);
// Payment Gateway Routes
router.post('/payment', user_controller_1.userController.payment);
// Redirect URL will be in app.ts file, Here redirect URL will not work
/**
 * MIDDLEWARE CONFIGURATION
 * --------------------------------
 * */
// router.get('/', verifyToken, isAdmin,  userController.getUsers)
exports.userRoutes = router;
