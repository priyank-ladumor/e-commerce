import mongoose, { Schema } from "mongoose"

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: [0, "too low"], required: true },
    discountPercentage: { type: Number },
    discountPrice: { type: Number },
    quantity: { type: Number, required: true },
    brand: { type: String },
    sizesAndColor: [
        {
            size: String,
            quantity: Number,
            color: String
        }
    ],
    images: [String],
    thumbnail: [String],
    rating: { type: Schema.Types.ObjectId, ref: "Rating" },
    review: { type: Schema.Types.ObjectId, ref: "Review" },
    numberRating: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Categories" },
    createdAt: { type: Date, default: Date.now() }

}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);