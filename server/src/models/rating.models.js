import mongoose, { Schema } from "mongoose"

const ratingSchema = new Schema({

    rating: { type: Number, required: true },
    createdAt: {type: Date, default: Date.now()},
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],

}, {timestamps: true});

export const Rating = mongoose.model("Rating", ratingSchema);