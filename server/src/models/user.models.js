import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    phone: { type: String },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    paymentInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment_Info" }],
    rating: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    createdAt: { type: Date, default: Date.now() },
    role: { type: String, required: true, default: "CUSTOMER" },
}, { timestamps: true });


export const User = mongoose.model("User", userSchema);