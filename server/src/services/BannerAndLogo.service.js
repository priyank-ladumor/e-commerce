import { Banner } from "../models/Banner.models.js";
import { uploadOnCloudinary } from "../multer/cloudinary.js"
import { v2 as cloudinary } from 'cloudinary';


export const AddBanner = async (req) => {
    const { BannerImgs } = req.body;
    const user = req.user;

    if (user) {
        const banner = await Banner.findOne();
        if (BannerImgs) {
            if (!banner) {
                const img = await uploadOnCloudinary(BannerImgs);
                const createBanner = new Banner({
                    BannerImgs: img,
                })
                await createBanner.save();
                return "Banner Added Successfully";
            } else {
                if(banner.BannerImgs?.length <= 9 ){
                    const img = await uploadOnCloudinary(BannerImgs);
                    await Banner.findOneAndUpdate({ _id: banner._id }, { $push: { BannerImgs: img } });
                    return "Banner Added Successfully";
                }else{
                    throw new Error('Max limit for banner is 10');
                }
            }
        } else {
            throw new Error('No Images Provided');
        }
    } else {
        throw new Error('User not found');
    }
}

// for (let i of banner.BannerImgs) {
//     const splitPic = i?.split("/")
//     splitPic && cloudinary.uploader.destroy([splitPic[splitPic.length - 1]?.split(".")[0]], { type: 'upload', resource_type: 'image' });
// }
// const addBanner = await Banner.updateOne({ BannerImgs });