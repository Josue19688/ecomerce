
import {Request} from 'express';

export const fileFilter = (req:Request, file:Express.Multer.File,callback:Function)=>{

    if(!file) return callback(new Error('File is empty.'),false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ["jpg","JPG","PNG","png","gif","jpeg","pdf","PDF"];

    if(validExtensions.includes(fileExtension)){
        return callback(null,true);
    }
    callback(null,false);
}

export const fileFilters = (req:Request, files:Express.Multer.File,callback:Function)=>{

    if(!files) return callback(new Error('File is empty.'),false);

    const fileExtension = files.mimetype.split('/')[1];
    const validExtensions = ["jpg","JPG","PNG","png","gif","jpeg","pdf","PDF"];

    if(validExtensions.includes(fileExtension)){
        return callback(null,true);
    }
    callback(null,false);
}