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


export { findUserById, findUserByEmail }
