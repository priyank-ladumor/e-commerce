import mongoose, { Schema } from "mongoose"

const bannerSchema = new Schema({
    BannerImgs: [
        { type: String, required: true }
    ]
});


export const Banner = mongoose.model("Banner", bannerSchema);