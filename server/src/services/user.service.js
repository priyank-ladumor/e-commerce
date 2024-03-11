import { getUserIdFromToken } from "../middlewares/jwtProvider.js"
import { User } from "../models/user.models.js"

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
        const userData = await User.findByIdAndUpdate({ _id: user._id }, { profileImg, mobile, firstName, lastName, email });
        if (userData) {
            return userData
        }
    } else {
        throw new Error("token is not valid")
    }
}



export { findUserById, findUserByEmail, findUserByToken, userDeleteById, userProfileUpdate }
