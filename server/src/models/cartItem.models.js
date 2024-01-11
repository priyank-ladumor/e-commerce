import mongoose, { Schema } from "mongoose"

const cartItemsSchema = new Schema({

    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true }],
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, required: true},
    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
});


export const CartItem = mongoose.model("CartItem", cartItemsSchema);