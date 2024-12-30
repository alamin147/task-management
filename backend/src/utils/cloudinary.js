import { v2 as cloudinary } from 'cloudinary';
import { configserverENV } from './configs.js';


export const uploadIMG = async (path, fileName) => {
    cloudinary.config({ 
        cloud_name: configserverENV.cloud_name, 
        api_key: configserverENV.cloud_api_key, 
        api_secret: configserverENV.cloud_api_secret 
    });
    try {
        const uploadResult = await cloudinary.uploader.upload(path, {
            public_id: fileName, 
        });
        
        // console.log('Upload Result:', uploadResult);
        return uploadResult;
    } catch (error) {
        console.error('Upload Error:', error);
    }

   return null
};

