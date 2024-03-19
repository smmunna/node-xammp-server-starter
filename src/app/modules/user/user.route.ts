import express from "express";
import { userController } from "./user.controller";
import verifyToken from "../../middleware/verifyToken.middleware";
import { isAdmin } from "../../middleware/auth.middleware";

const router = express.Router()

router.post('/', userController.createUser)
router.post('/login', userController.signInUser)
router.get('/', verifyToken, isAdmin, userController.getUsers)
// File Management Routes
router.post('/upload', userController.fileUpload)
router.delete('/delete/:filename', userController.deleteFileData)

/**
 * MIDDLEWARE CONFIGURATION
 * --------------------------------
 * */

// router.get('/', verifyToken, userController.getUsers)

export const userRoutes = router;