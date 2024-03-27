import mongoose, { Schema } from "mongoose"

const bannerSchema = new Schema({
    BannerImgs: [
        { String }
    ]
});


export const Banner = mongoose.model("Banner", bannerSchema);