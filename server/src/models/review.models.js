import mongoose, { Schema } from "mongoose"

const reviewSchema = new Schema({

    review: { type: String, required: true },
    createdAt: {type: Date, default: Date.now()},
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],

}, {timestamps: true});

export const Review = mongoose.model("Review", reviewSchema);