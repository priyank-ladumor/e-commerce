import mongoose, { Schema } from "mongoose"

const bannerSchema = new Schema({
    BannerImgs: [
        {
            img: [String],
        }
    ],
});


export const Banner = mongoose.model("Banner", bannerSchema);