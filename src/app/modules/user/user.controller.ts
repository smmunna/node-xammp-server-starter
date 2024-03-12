import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import upload from "../../utils/fileManagement/upload";
import deleteFile from "../../utils/fileManagement/deleteFile";
import { con } from "../../../server";

// Create user
const createUser = async (req: Request, res: Response, next: NextFunction) => {
        // Create user configuration here
        
}

// Get users
const getUsers = async (req: Request, res: Response, next: NextFunction) => {

    con.query('SELECT * FROM `user_info`', (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(200).json({
                success: true,
                message: 'User info fetched successfully',
                result: result,
            });
        }
    });

}

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
        // Use the Multer middleware to handle the file upload
        upload.single('photo')(req, res, (err: any) => {
            if (err) {
                // Handle Multer error (e.g., file size exceeds limit)
                return res.status(400).send(err.message);
            }

            // Multer has processed the file, and it can be accessed in req.file
            const uploadedFile = req.file;

            // Respond with the uploaded file in the response
            res.status(200).json({
                message: 'Photo uploaded successfully',
                file: uploadedFile,
                nextUrl: `${req.protocol}://${req.get('host')}/` + uploadedFile?.path.replace(/\\/g, "/")
            });
        });
    } catch (error) {
        console.error('Error in userPhoto controller:', error);
        res.status(500).send('Internal Server Error');
    }
}

// File Deleting
const deleteFileData = (req: Request, res: Response) => {
    const filename = req.params.filename;
    // console.log(filename);

    // Call deleteFile function with filename and handle the result
    deleteFile(filename, (error, message) => {
        if (error) {
            res.status(500).send({ message: error.message }); // Handle error
        } else {
            res.send({ message: message }); // File deletion successful
        }
    });


}

// These are accessible from different files.
export const userController = {
    createUser,
    getUsers,
    signInUser,
    fileUpload,
    deleteFileData
}