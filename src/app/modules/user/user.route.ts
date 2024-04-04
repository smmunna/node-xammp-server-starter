import express from "express";
import { userController } from "./user.controller";
import verifyToken from "../../middleware/verifyToken.middleware";
import { isAdmin } from "../../middleware/auth.middleware";
import { checkUserRoleAndRateLimit as limiter } from "../../middleware/apiRateLimit.middleware";

const router = express.Router()

router.post('/', userController.createUser)
router.post('/login', userController.signInUser)
router.get('/', userController.getUsers)
// File Management Routes
router.post('/upload', userController.fileUpload)
router.delete('/delete/:filename', userController.deleteFileData)

// Payment Gateway Routes

// Redirect URL will be in app.ts file, Here redirect URL will not work


/**
 * MIDDLEWARE CONFIGURATION
 * --------------------------------
 * */

// router.get('/', verifyToken, isAdmin,  userController.getUsers)

export const userRoutes = router;