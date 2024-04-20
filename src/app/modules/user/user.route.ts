import express from "express";
import { userController } from "./user.controller";
import verifyToken from "../../middleware/verifyToken.middleware";
import { isAdmin, isUser } from "../../middleware/auth.middleware";
import { checkUserRoleAndRateLimit } from "../../middleware/apiRateLimit.middleware";

const router = express.Router()

router.post('/', userController.createUser)
router.post('/login', userController.signInUser)
router.get('/:id', userController.getSingleUser)
router.put('/', userController.updateUser)
router.delete('/:id', userController.deleteUser)


// Payment Gateway Routes

// Redirect URL will be in app.ts file, Here redirect URL will not work


/**
 * MIDDLEWARE CONFIGURATION
 * --------------------------------
 * */

// router.get('/', verifyToken, isAdmin,  userController.getUsers)

export const userRoutes = router;