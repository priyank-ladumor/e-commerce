import mongoose, { Schema } from "mongoose"

const multerSchema = new Schema({
    imgs: [String]
});


export const Multer = mongoose.model("Multer", multerSchema);