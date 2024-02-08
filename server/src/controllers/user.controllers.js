import { User } from "../models/user.models.js";
import bcrypt from "bcrypt"
import { getUserIdFromToken, generateToken } from "../middlewares/jwtProvider.js"
import { findUserByEmail, findUserById, findUserByToken, userDeleteById } from "../services/user.service.js";
import * as fs from 'fs';
import handlebars from "handlebars"
import { sendEmail } from "../services/email.service.js";
import { createCart } from "../services/cart.service.js";



const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const items = {
        firstName,
        lastName,
        email,
        password
    }
    const isUserExit = await User.findOne({ email })

    try {
        if (isUserExit) {
            return res.status(400).send({ msg: "user email address is already used" });
        } else {
            const user = new User(items);
            const pass = await bcrypt.hash(password, 10);
            user.password = pass;
            const token = generateToken(user._id);
            await user.save();
            if (user) {
                const source = await fs.readFileSync('././public/email-templates/verificationAccount.html', 'utf-8').toString();
                const template = await handlebars.compile(source)
                const replacement = {
                    link: `http://localhost:3000/user/verified/${token}`,
                    name: user.firstName
                }
                const email_template = await template(replacement)
                const subject = "Verification Account"

                const items = {
                    email: user.email, subject, email_template
                }
                const sendVerifyMail = await sendEmail(items)
            }
            await createCart(user);
            res.status(200).send({ msg: "user created successfully please check your email for verification", token: token, name: user.firstName })
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const items = {
        email,
        password
    }
    try {
        const user = await findUserByEmail(email)
        if (user) {
            if (user.isEmailVerified === true) {
                const isPassValid = await bcrypt.compare(password, user.password)
                if (isPassValid) {
                    const token = generateToken(user._id)
                    return res.status(200).send({ msg: "user login successfully", token, role: user.role })
                } else {
                    return res.status(401).send({ msg: "user password doesn't match" })
                }
            } else {
                return res.status(403).send({ msg: "Please verify your account first" })
            }
        } else {
            return res.status(404).send({ msg: "user not exits" })
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}


const userEmailVerifiedByToken = async (req, res) => {
    const { token } = req.params;
    if (token) {
        const userId = await getUserIdFromToken(token);
        const user = await User.findByIdAndUpdate({ _id: userId }, { isEmailVerified: true }, { new: true });
        if (user.isEmailVerified === true) {
            return res.status(200).send({ msg: "user account verified" })
        } else {
            return res.status(400).send({ msg: "Server Error!" })
        }
    } else {
        return res.status(401).send({})
    }
}


const getUserProfile = async (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    const token = req.headers.authorization;
    try {
        if (token) {
            const user = await findUserByToken(token)
            return res.status(200).send(user)
        } else {
            return res.status(401).send({})
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

export const getAllUserProfiles = async (req, res) => {
    const { pageNumber, pageSize, search } = req.query;
    // try {
    //     let items = await User.find().skip((pageNumber - 1) * pageSize).limit(pageSize);
    //     const totalUserCount = await User.countDocuments(items);
    //     const totalPages = Math.ceil(totalUserCount / pageSize);
    //     const payload = { content: items, currentPage: pageNumber, totalPages: totalPages }
    //     return res.status(200).send(payload)
    // } catch (error) {
    //     return res.status(500).send({ msg: error.message })
    // }
    try {

        let items = search ? User.find({ email: { $regex: '.*' + search + '.*' } }) : User.find()

        const totalUserCount = await User.countDocuments(items);
        const users = await items.skip((pageNumber - 1) * pageSize).limit(pageSize);
        const totalPages = Math.ceil(totalUserCount / pageSize);
        const payload = { content: users, currentPage: pageNumber, totalPages: totalPages }
        return res.status(200).send(payload)
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const userDeleteByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await findUserById(id)
        const deleteUser = await userDeleteById(id)
        if (deleteUser.deletedCount === 1) {
            res.status(200).send({ msg: `${user.firstName} deleted successfully` });
        }
        if (!user) return res.status(404).send({ msg: 'No such user exits' })
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const userBannedByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await findUserById(id)
        if (user.status === "Banned") return res.status(404).send({ msg: `${user.firstName} banned already.` })
        if (user.status = "Active") {
            user.status = "Banned"
            user.save();
            res.status(200).send({ msg: `${user.firstName} banned successfully` });
        }
        if (!user) return res.status(404).send({ msg: 'No such user exits' })
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const userActiveByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await findUserById(id)
        if (user.status === "Active") return res.status(404).send({ msg: `${user.firstName} active already.` })
        if (user.status === "Banned") {
            user.status = "Active"
            user.save();
            res.status(200).send({ msg: `${user.firstName} active successfully` });
        }
        if (!user) return res.status(404).send({ msg: 'No such user exits' })
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

// const getSearchUsersController = async (req, res) => {
// console.log(req);
// const { pageNumber, pageSize, search } = req.body;
// if (search && pageNumber && pageSize) {
// let query = User.find({ email: { $regex: '.*' + search + '.*' } })
// const totalQuantity = await User.countDocuments(query);
// const finalQuery = await query.skip((pageNumber - 1) * pageSize).limit(pageSize);
// const totalPages = Math.ceil(totalQuantity / pageSize);

// return { content: finalQuery, currentPage: pageNumber, totalPages: totalPages }
// } else {
//     throw new Error("did not get search data")
// }
// try {
// const searchQuery =  (await User.find()).filter(item => item.email.includes(req.query.search))
// } catch (error) {
// return res.status(500).send({ msg: error.message })
// }
// }



export { createUser, loginUser, userEmailVerifiedByToken, getUserProfile, userDeleteByIdController, userBannedByIdController, userActiveByIdController }