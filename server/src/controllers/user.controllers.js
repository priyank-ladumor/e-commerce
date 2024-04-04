import { User } from "../models/user.models.js";
import bcrypt from "bcrypt"
import { getUserIdFromToken, generateToken } from "../middlewares/jwtProvider.js"
import { findUserByEmail, findUserById, findUserByToken, resetPassword, userDeleteById, userProfileUpdate } from "../services/user.service.js";
import * as fs from 'fs';
import handlebars from "handlebars"
import { sendEmail } from "../services/email.service.js";
import { createCart } from "../services/cart.service.js";
import path from "path";


const createUser = async (req, res) => {
    const { firstName, lastName, email, password, location } = req.body;
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

            const emailTemplate = 
            `
            <!DOCTYPE html>

            <head>
                <title>Pug</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="preconnect" href="https://unpkg.com">
                <link rel="stylesheet" href="https://unpkg.com/bootstrap@5.2.2/dist/css/bootstrap.css">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300:400&amp;family=Poppins:wght@300;500&amp;display=swap"
                    rel="stylesheet">
                <style>
                    body {
                        background-color: #f9f9f9;
                        padding-right: 10px;
                        padding-left: 10px;
                    }
            
                    .content {
                        background-color: #ffffff;
                        border-color: #e5e5e5;
                        border-style: solid;
                        border-width: 0 1px 1px 1px;
                        max-width: 600px;
                        width: 100%;
                        height: 550px;
                        margin-top: 60.5px;
                        margin-bottom: 31px;
                        border-top: solid 3px #8e2de2;
                        border-top: solid 3px -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
                        border-top: solid 3px -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
                        text-align: center;
                        padding: 100px 0px 0px;
                    }
            
                    h1 {
                        padding-bottom: 5px;
                        color: #000;
                        font-family: Poppins, Helvetica, Arial, sans-serif;
                        font-size: 28px;
                        font-weight: 400;
                        font-style: normal;
                        letter-spacing: normal;
                        line-height: 36px;
                        text-transform: none;
                        text-align: center;
                        padding-top: 25px;
                    }
            
                    h2 {
                        margin-bottom: 30px;
                        color: #999;
                        font-family: Poppins, Helvetica, Arial, sans-serif;
                        font-size: 16px;
                        font-weight: 300;
                        font-style: normal;
                        letter-spacing: normal;
                        line-height: 24px;
                        text-transform: none;
                        text-align: center;
                    }
            
                    h3 {
                        padding-top: 10px;
                    }
            
                    p {
                        font-size: 14px;
                        margin: 0px 21px;
                        color: #666;
                        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
                        font-weight: 300;
                        font-style: normal;
                        letter-spacing: normal;
                        line-height: 22px;
                        margin-bottom: 40px;
                    }
            
                    .btn-primary {
                        background: #8e2de2;
                        background: -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
                        background: linear-gradient(to right, #8e2de2, #4a00e0);
                        border: none;
                        font-family: Poppins, Helvetica, Arial, sans-serif;
                        font-weight: 200;
                        font-style: normal;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        text-decoration: none;
                    }
            
                    footer {
                        max-width: 600px;
                        width: 100%;
                        height: 420px;
                        padding-top: 50px;
                        text-align: center;
                    }
            
                    small {
                        color: #bbb;
                        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
                        font-size: 12px;
                        font-weight: 400;
                        font-style: normal;
                        letter-spacing: normal;
                        line-height: 20px;
                        text-transform: none;
                        margin-bottom: 5px;
                        display: block;
                    }
            
                    small:last-child {
                        margin-top: 20px;
                    }
            
                    a {
                        color: #bbb;
                        text-decoration: underline;
                    }
                </style>
            </head>
            <div class="center-div">
                <div class="d-flex align-items-center justify-content-center align-items-center">
                        <div class="content">
                        <img src='https://i.imgur.com/d7MoWpc.png' alt="Your Company" style="height: 50px; border: rounded;">
                        <h3>Welcome to Shoppy.io</h3>
                        <h1>Hello, {{name}}</h1>
                        <h2>Verify Your Email Account</h2>
                        <p>Thanks for creating your account on our platform! Please click on confirm button to validate your
                            account.
                        </p>
                        <a href="{{link}}" class="btn btn-primary btn-lg" type="button"
                            style="padding: 5px; color:#ffffff; font:800">Click Here</a>
                    </div>
                </div>
            </div>`

            const user = new User(items);
            const pass = await bcrypt.hash(password, 10);
            user.password = pass;
            const token = generateToken(user._id);
            await user.save();
            if (user) {
                // const filePath = path.resolve(process.cwd(), 'public', 'email-templates', 'verificationAccount.html');
                // const source = fs.readFileSync(filePath, 'utf-8').toString();
                // const template = handlebars.compile(source)
                const compiledTemplate = handlebars.compile(emailTemplate);

                const replacement = {
                    link: `${location}/user/verified/${token}`,
                    name: user.firstName
                }
                const email_template = compiledTemplate(replacement)
                // const email_template = template(replacement)
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
                if (user.status === "Active") {
                    const isPassValid = await bcrypt.compare(password, user.password)
                    if (isPassValid) {
                        const token = generateToken(user._id)
                        return res.status(200).send({ msg: "user login successfully", token, role: user.role })
                    } else {
                        return res.status(401).send({ msg: "user password doesn't match" })
                    }
                } else {
                    return res.status(403).send({ msg: `Your account has been deactivated by admin` })
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

const userProfileUpdateController = async (req, res) => {
    try {
        const updateProfile = await userProfileUpdate(req);
        if (updateProfile) {
            res.status(200).send({ msg: "User Profile Updated Successfully" });
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

const resetPasswordController = async (req, res) => {
    try {
        const reset = await resetPassword(req);
        if (reset) {
            res.status(200).send({ msg: "User Password Reset Successfully" });
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}



export { createUser, loginUser, userEmailVerifiedByToken, getUserProfile, userDeleteByIdController, userBannedByIdController, userActiveByIdController, userProfileUpdateController, resetPasswordController }