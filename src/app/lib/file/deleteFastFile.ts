import path from 'path';
import fs from 'fs';

const deleteFastFile = (path: any) => {
    fs.unlink(path, (err) => {
        if (err) {
            console.error('Error instant deleting file:', err);
        }
        console.log('');
    });
}

export default deleteFastFile;