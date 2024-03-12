import { getUserIdFromToken } from "../middlewares/jwtProvider.js"
import { User } from "../models/user.models.js"
import bcrypt from "bcrypt"
import { uploadOnCloudinary } from "../multer/cloudinary.js"

const findUserByEmail = async (email) => {
    try {
        if (email) {
            const user = await User.findOne({ email })
            return user
        } else {
            throw new Error({ msg: "user not found" })
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const findUserById = async (id) => {
    try {
        if (id) {
            const user = User.findById(id)
            return user
        } else {
            throw new Error({ msg: "user not found" })
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const userDeleteById = async (id) => {
    if (id) {
        const result = await User.deleteOne({ _id: id })
        return result;
    } else {
        throw new Error({ msg: "id not found" })
    }
}

const findUserByToken = async (token) => {
    try {
        if (token) {
            const id = await getUserIdFromToken(token)
            const user = await User.findById(id)
            return user
        } else {
            throw new Error({ msg: "user not found" })
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const userProfileUpdate = async (req) => {
    const { firstName, lastName, email, mobile, profileImg } = req.body;
    const user = req.user;
    if (user) {
        if (profileImg?.length > 0) {
            const img = await uploadOnCloudinary(profileImg);
            const userData = await User.findByIdAndUpdate({ _id: user._id }, { profileImg: img, mobile, firstName, lastName, email });
            if (userData) {
                return userData
            }
        } else {
            const userData = await User.findByIdAndUpdate({ _id: user._id }, { mobile, firstName, lastName, email });
            if (userData) {
                return userData
            }
        }
    } else {
        throw new Error("token is not valid")
    }
}

const resetPassword = async (req) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;
    const user = req.user;
    const findUser = await User.findById(id)

    if (findUser._id.toString() === user._id.toString()) {
        const pass = await bcrypt.compareSync(oldPassword, findUser.password);
        if (pass) {
            const NewPass = await bcrypt.hashSync(newPassword, 10);
            findUser.password = NewPass;
            findUser.save();
            return findUser;
        } else {
            throw new Error("old password is wrong")
        }
    } else {
        throw new Error("token is not valid")
    }
}



export { findUserById, findUserByEmail, findUserByToken, userDeleteById, userProfileUpdate, resetPassword }
