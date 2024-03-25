import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import deleteFile from "../../utils/fileManagement/deleteFile";
import { Query } from "../../lib/dbQuery/queryCollection";
import { fileUpload as myFileUpload } from "../../utils/fileManagement/upload.config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {

};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const userQuery = 'SELECT COUNT(email) FROM `user_info`';
    try {
        const userResult = await Query.selectAll('user_info');

        res.status(200).json({
            success: true,
            message: 'User info fetched successfully',
            users: userResult
        });
    } catch (err) {
        next(err);
    }

};

/**
 * JWT GENERATE TOKEN WHEN SIGN IN USER
 * -------------------------------------
 * When user will sign in, then jwt token will be generated
 * */

const signInUser = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    // const password = req.body.password;

    const user = email

    /**
     * You can check the user email and password Here ;
     * If successful user, then sign token and login successful else Unauthorized user,Invalid Login
     * */

    // Sign in jwt token
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign({ user }, `${accessTokenSecret}`, {
        expiresIn: '1h'
    })

    res.status(200).json({
        success: true,
        user: user,
        token: token
    });
}

// File Uploading
const fileUpload = async (req: Request, res: Response) => {

    try {
        myFileUpload.single('file')(req, res, (err: any) => {
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
                photoURL: `${req.protocol}://${req.get('host')}/` + uploadedFile?.path.replace(/\\/g, "/") //use protocol `https://` use extra s
            });
        });
    } catch (error) {
        console.error('Error in userPhoto controller:', error);
        res.status(500).send('Internal Server Error');
    }
}

// File Deleting
const deleteFileData = (req: Request, res: Response) => {
    const directoryPath = 'uploads/documents'; // Pass the directory path here
    const fileName = req.params.filename; // Pass the file name here
    deleteFile(directoryPath, fileName, (error, message) => {
        if (error) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(200).send({ message: message }); // File deletion successful
        }
    });
}

// These are accessible from different files.
export const userController = {
    createUser,
    getUsers,
    signInUser,
    fileUpload,
    deleteFileData,
}