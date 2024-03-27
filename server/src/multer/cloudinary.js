import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        // base64 imgs
        if (!localFilePath) return null
        let imgUrls = []
        for (let i = 0; i < localFilePath.length; i++) {
            const res = await cloudinary.uploader.upload(localFilePath[i], {
                resource_type: "auto"
            })
            imgUrls.push(res.secure_url);
            console.log("file is uploaded on cloudinary", res.secure_url);
        }
        return imgUrls;
    } catch (error) {
        console.log(error.message);
    }

    // for imgs formData

    // const path = await localFilePath.map((ele) => `${process.env.IMG_PATH}${ele.originalname}`);
    // try {
    //     if (!localFilePath) return null
    //     let imgUrls = []
    //     for (let i = 0; i < path.length; i++) {
    //         const res = await cloudinary.uploader.upload(path[i], {
    //             resource_type: "auto"
    //         })
    //         imgUrls.push(res.secure_url);
    //         console.log("file is uploaded on cloudinary", res.secure_url);
    //         fs.unlinkSync(path[i]);
    //     }
    //     return imgUrls;
    // } catch (error) {
    //     fs.unlinkSync(path)
    //     console.log(error.message);
    // }
}