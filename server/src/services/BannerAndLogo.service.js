import { Banner } from "../models/Banner.models.js";
import { uploadOnCloudinary } from "../multer/cloudinary.js"
import { v2 as cloudinary } from 'cloudinary';


export const AddBanner = async (req) => {
    const { BannerImgs } = req.body;
    const user = req.user;
    if (user) {
        const banner = await Banner.findOne();
        const imgId = Math.floor(Math.random() * 100000 + 1)
        if (BannerImgs) {
            if (!banner) {
                const img = await uploadOnCloudinary(BannerImgs);
                const createBanner = new Banner({
                    BannerImgs: { img, imgId: imgId },
                })
                await createBanner.save();
                return "Banner Added Successfully";
            } else {
                if (banner.BannerImgs?.length <= 9) {
                    const img = await uploadOnCloudinary(BannerImgs);
                    await Banner.findOneAndUpdate({ _id: banner._id }, { $push: { BannerImgs: { img, imgId: imgId } } });
                    return "Banner Added Successfully";
                } else {
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

export const getAllBanner = async (req) => {
    const user = req.user;
    if (user) {
        const banner = await Banner.findOne();
        if (banner) {
            return banner.BannerImgs;
        } else {
            throw new Error('there is no banner added!');
        }
    } else {
        throw new Error('User not found');
    }
}

export const deleteBanner = async (req) => {
    const { url } = req.params;
    const user = req.user;
    if (user) {
        const banner = await Banner.findOne();
        const splitPic = url
        splitPic && cloudinary.uploader.destroy([url?.split("/")[7].split(".")[0]], { type: 'upload', resource_type: 'image' });
        if (banner) {
            await Banner.findOneAndUpdate({ _id: banner._id }, { $pull: { BannerImgs: url } });
            return "Banner Removed Successfully!";
        } else {
            throw new Error('there is no banner added!');
        }
    } else {
        throw new Error('User not found');
    }
}
