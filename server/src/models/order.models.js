import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema({

    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
    orderDate: { type: Date, required: true, default: Date.now() },
    deliveredDate: { type: Date },
    shippingAddress: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    paymentDetails: {
        paymentMethod: {
            type: String
        },
        transactionId: {
            type: String
        },
        paymentId: {
            type: String
        },
        paymentStatus: {
            type: String,
            default: "PENDING"
        },
    },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, required: true, default: "Placed" },
    totalItem: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now() },

}, { timestamps: true });


export const Order = mongoose.model("Order", orderSchema);