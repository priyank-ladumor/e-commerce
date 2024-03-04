import mongoose, { Schema } from "mongoose"

const cartItemsSchema = new Schema({

    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true }],
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    // discountedPrice: { type: Number, required: true},
});

export const CartItem = mongoose.model("CartItem", cartItemsSchema);