import { Banner } from "../models/Banner.models.js";
import { Logo } from "../models/Logo.models.js";
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
                const imgs = {
                    img
                }
                const createBanner = img && new Banner({
                    BannerImgs: imgs,
                })
                await createBanner.save();
                return "Banner Added Successfully";
            } else {
                if (banner.BannerImgs?.length <= 9) {
                    const img = await uploadOnCloudinary(BannerImgs);
                    const imgs = {
                        img
                    }
                    img && await Banner.findOneAndUpdate({ _id: banner._id }, { $push: { BannerImgs: imgs } });
                    return "Banner Added Successfully";
                }
                else {
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
    const banner = await Banner.findOne();
    if (banner) {
        return banner.BannerImgs;
    } else {
        throw new Error('there is no banner added!');
    }
}

export const deleteBanner = async (req) => {
    const { id } = req.params;
    const user = req.user;
    if (user) {
        const banner = await Banner.findOne();

        if (banner) {

            const imgURL = banner?.BannerImgs?.filter((item) => item._id.toString() === id.toString())
            imgURL && cloudinary.uploader.destroy([imgURL[0].img[0]?.split("/")[7].split(".")[0]], { type: 'upload', resource_type: 'image' });

            const data = banner?.BannerImgs?.filter((item) => item._id.toString() !== id.toString());

            await Banner.updateOne({
                _id: banner._id,
                "BannerImgs._id": id,
            }, {
                $set: {
                    'BannerImgs': data
                }
            })
            return "Banner Removed Successfully!";
        } else {
            throw new Error('there is no banner added!');
        }
    } else {
        throw new Error('User not found');
    }
}


export const addLogo = async (req) => {
    const user = req.user;
    const { logo } = req.body;
    if (user) {
        const res = await cloudinary.uploader.upload(logo[0], {
            folder: 'Shoppy.io Logo',
            resource_type: "auto"
        })
        const findLogo = await Logo.findOne()
        if (findLogo === null) {
            const createLogo = new Logo({
                logo: res.secure_url
            })
            createLogo.save();
            return "Logo Added Successfully!"
        } else {
            findLogo && cloudinary.uploader.destroy(["Shoppy.io Logo/" + findLogo.logo[0]?.split("/")[8].split(".")[0]], { type: 'upload', resource_type: 'image' });
            const logoArr = [res.secure_url]
            await Logo.findOneAndReplace({ _id: findLogo._id }, { logo: logoArr })
            return "Logo Change Successfully!"
        }
    } else {
        throw new Error('User not found or token expired ');
    }
}

export const getLogo = async (req) => {
    const findLogo = await Logo.findOne()
    if (findLogo !== null) {
        const LogoImg = {
            logo: findLogo.logo[0]
        }
        return LogoImg;
    } else {
        throw new Error('no logo added');
    }
}