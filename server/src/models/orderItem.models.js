import mongoose, { Schema } from "mongoose"

const orderItemsSchema = new Schema({

    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    size: { type: String , required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }]

}, { timestamps: true });


export const OrderItem = mongoose.model("OrderItem", orderItemsSchema);