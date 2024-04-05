import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from 'express-validator';
import deleteFile from "../../utils/fileManagement/deleteFile";
import { Query } from "../../lib/dbQuery/queryCollection";
import { fileUpload as myFileUpload, photoUpload } from "../../utils/fileManagement/upload.config";
import deleteFastFile from "../../lib/file/deleteFastFile";
import passwordHash from 'password-hash';
import parsedURL from "../../lib/file/photoPath";
import sendApiResponse from "../../lib/ApiResponse/sendApiResponse";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        photoUpload.single('photo')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading photo:', err);
                return next(err);
            }

            // Access form data and uploaded file
            const { name, password, email } = req.body;
            const photoPath = req.file?.path;
            const photoURL = `${req.protocol}://${req.get('host')}/` + photoPath?.replace(/\\/g, "/")
            const hashedPassword = passwordHash.generate(password)


            const existingUser = await Query.selectOne('users', 'email', email)
            if (existingUser) {
                deleteFastFile(photoPath);
                return res.status(400).send({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Check for missing or empty fields
            if (!name || !password || !email || !photoPath) {
                // Delete the file if it exists
                if (photoPath) {
                    deleteFastFile(photoPath);
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
                const result = await Query.executeQuery(query);

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
            } catch (error) {
                console.error('Error executing query:', error);
                next(error);
            }
        });
    } catch (error) {
        console.error('Error in createUser controller:', error);
        next(error);
    }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const userQuery = 'SELECT COUNT(email) FROM `user_info`'
    try {
        const userResult = await Query.Paginate('users', 1, 3, [], 'id', 'DESC', { name: 'i', email: 'u' });

        sendApiResponse(res, 200, true, 'User fetched successfully', userResult)
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

// Update User -with Form data
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        photoUpload.single('photo')(req, res, async (err) => {
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
            const user = await Query.selectOneWithColumn('users', ['name', 'email', 'password', 'image'], 'email', email);

            // If user exists and photo is provided, delete old photo
            if (user && req.file && user.image) {
                deleteFastFile(parsedURL(user.image));
            }

            // Construct update query
            let query = `UPDATE users SET`;
            const updateFields = []; // Initialize an array to store update fields

            if (name !== undefined && name !== null) {
                updateFields.push(`name = '${name}'`);
            }
            if (password) {
                updateFields.push(`password = '${passwordHash.generate(password)}'`);
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
            const result = await Query.executeQuery(query);

            if (result) {
                // Success response
                res.status(200).send({
                    success: true,
                    message: 'User updated successfully',
                    updated: result
                });
            } else {
                // Error response
                res.status(400).send({
                    success: false,
                    message: 'User update failed'
                });
            }
        });
    } catch (error) {
        next(error);
    }
}

// Delete user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        // Validate ID to prevent SQL injection
        if (!/^\d+$/.test(id)) {
            throw new Error("Invalid ID");
        }

        // User Existance
        const userExistance = await Query.selectOne('users', 'id', id);
        if (!userExistance) {
            res.status(404).send({
                success: false,
                message: "User does not exist",
            })
        }
        else {
            const user = await Query.executeQuery(`SELECT image FROM users WHERE id ='${id}'`)
            const path = parsedURL(user[0].image) //Old image URL
            const query = `DELETE FROM users WHERE id = ${id}`;
            const result = await Query.executeQuery(query);

            if (result) {
                res.status(200).send({
                    success: true,
                    message: 'User deleted successfully',
                    deleted: result
                });
                deleteFastFile(path);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'User deletion failed'
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

// These are accessible from different files.
export const userController = {
    createUser,
    getUsers,
    signInUser,
    fileUpload,
    deleteFileData,
    updateUser,
    deleteUser
}