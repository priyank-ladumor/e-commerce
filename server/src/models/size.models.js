import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema({
    label: String, 
    options: [
        String
    ],
})

export const Size = mongoose.model("Size", sizeSchema);