import mongoose, { Schema } from "mongoose"

const orderItemsSchema = new Schema({

    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    size: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }]

}, { timestamps: true });


export const OrderItem = mongoose.model("OrderItem", orderItemsSchema);