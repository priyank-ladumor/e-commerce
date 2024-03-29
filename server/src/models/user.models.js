import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    mobile: { type: String },
    profileImg: [String],
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    paymentInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment_Info" }],
    rating: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    role: { type: String, required: true, default: "CUSTOMER" },
    status: { type: String, default: "Active" }
}, { timestamps: true });


export const User = mongoose.model("User", userSchema);