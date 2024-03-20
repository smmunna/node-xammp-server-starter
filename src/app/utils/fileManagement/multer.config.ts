import multer from 'multer';
import path from 'path';

const configureMulter = (fieldName: string, allowedMimeTypes: string[], destinationPath: string, filenamePrefix: string, fileSizeLimit: any) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const filename = file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') + '-' + Date.now();

            cb(null, filename + fileExt);
        }
    });

    const fileFilter = (req: any, file: any, cb: any) => {
        if (file.fieldname === fieldName) {
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`Only ${allowedMimeTypes} is allowed`));
            }
        } else {
            cb(new Error('There was an unknown error'));
        }
    };

    return multer({
        storage: storage,
        limits: {
            fileSize: fileSizeLimit
        },
        fileFilter: fileFilter
    });
};

export default configureMulter;

