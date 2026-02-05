// Usable code
// It gets the file in local storage then with help of local path it stores it in servers(cloudinary server) and 
// deletes the files form temporary storage

import {v2 as cloudinary} from "cloudinary"

    // Configuration
    cloudinary.config({ 
        cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
        api_key: 'process.env.CLOUDINARY_API_KEYS', 
        api_secret: '<process.env. CLOUDINARY_API_SECRET>' 
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null;
            //upload file on cloudinary
            const response = await cloudinary.uploader.upload( localFilePath, {
                resource_type : "auto"  //for file type
            } )
            //file has been upload successfully
            console.log("file is uploaded on cloudinary", response.url); //we take the url after upload on cloudinary
            return response;

        } catch (error) {
            //remove the localyy saved temporary file as the uploaf operation got failed
            fs.unlinkSync(localFilePath)
            return null;
        }
    }
    
export {uploadOnCloudinary};
