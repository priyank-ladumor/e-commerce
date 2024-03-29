import mongoose, { Schema } from "mongoose"

const logoSchema = new Schema({
    logo: [
        String
    ],
});


export const Logo = mongoose.model("Logo", logoSchema);