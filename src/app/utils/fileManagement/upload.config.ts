import configureMulter from "./multer.config";

/**
 * Configure multer for uploading documents.
 * 
 * @param {string} fieldName - The name of the field in the form.
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types.
 * @param {string} destinationPath - The destination directory for storing uploaded files.
 * @param {string} filenamePrefix - Prefix for generated file names.
 * @param {number} fileSizeLimit - Maximum allowed file size in bytes.
 * @returns {object} - Configured multer instance.
 */
const documentUpload = configureMulter(
    'doc', // fieldName
    ['application/pdf'], // allowedMimeTypes
    './uploads/documents/', // destinationPath
    'document', // filenamePrefix
    5000000 // fileSizeLimit (5 MB)
);

/**
 * Configure multer for uploading photos.
 * 
 * @param {string} fieldName - The name of the field in the form.
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types.
 * @param {string} destinationPath - The destination directory for storing uploaded files.
 * @param {string} filenamePrefix - Prefix for generated file names.
 * @param {number} fileSizeLimit - Maximum allowed file size in bytes.
 * @returns {object} - Configured multer instance.
 */
const photoUpload = configureMulter(
    'photo', // fieldName
    ['image/jpeg', 'image/png', 'image/jpg'], // allowedMimeTypes
    './uploads/photos/', // destinationPath
    'photo', // filenamePrefix
    1000000 // fileSizeLimit (1 MB)
);

/**
 * Configure multer for uploading videos.
 * 
 * @param {string} fieldName - The name of the field in the form.
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types.
 * @param {string} destinationPath - The destination directory for storing uploaded files.
 * @param {string} filenamePrefix - Prefix for generated file names.
 * @param {number} fileSizeLimit - Maximum allowed file size in bytes.
 * @returns {object} - Configured multer instance.
 */
const videoUpload = configureMulter(
    'video', // fieldName
    ['video/mp4', 'video/mpeg'], // allowedMimeTypes
    './uploads/videos/', // destinationPath
    'video', // filenamePrefix
    50000000 // fileSizeLimit (50 MB)
);

/**
 * Configure multer for uploading audio files.
 * 
 * @param {string} fieldName - The name of the field in the form.
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types.
 * @param {string} destinationPath - The destination directory for storing uploaded files.
 * @param {string} filenamePrefix - Prefix for generated file names.
 * @param {number} fileSizeLimit - Maximum allowed file size in bytes.
 * @returns {object} - Configured multer instance.
 */
const audioUpload = configureMulter(
    'audio', // fieldName
    ['audio/mpeg', 'audio/wav'], // allowedMimeTypes
    './uploads/audio/', // destinationPath
    'audio', // filenamePrefix
    20000000 // fileSizeLimit (20 MB)
);

/**
 * Configure multer for uploading general files.
 * 
 * @param {string} fieldName - 'file' The name of the field in the form.
 * @param {string[]} allowedMimeTypes - ['application/pdf', 'application/msword', 'application/vnd.ms-excel'], Array of allowed MIME types.
 * @param {string} destinationPath - './uploads/files/' The destination directory for storing uploaded files.
 * @param {string} filenamePrefix - Prefix for generated file names.
 * @param {number} fileSizeLimit - 10 MB Maximum allowed file size in bytes.
 * @returns {object} - Configured multer instance.
 */
const fileUpload = configureMulter(
    'file', // fieldName
    [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ], // allowedMimeTypes
    './uploads/files/', // destinationPath
    'file', // filenamePrefix
    10000000 // fileSizeLimit (10 MB)
);


/**
 * Configure multer for uploading any type of file.
 * 
 * @param {string} fieldName - 'file' The name of the field in the form.
 * @param {string} destinationPath - './uploads/files/' The destination directory for storing uploaded files.
 * @param {string} filenamePrefix - 'file' Prefix for generated file names.
 * @param {number} fileSizeLimit - 10MB Maximum allowed file size in bytes.
 * @returns {object} - Configured multer instance.
 */
const anyFileUpload = configureMulter(
    'file', // fieldName
    ['*/*'], // allowedMimeTypes (Wildcard MIME type to accept any file type)
    './uploads/files/', // destinationPath
    'file', // filenamePrefix
    10000000 // fileSizeLimit (10 MB)
);

export { documentUpload, photoUpload, videoUpload, audioUpload, fileUpload, anyFileUpload };
