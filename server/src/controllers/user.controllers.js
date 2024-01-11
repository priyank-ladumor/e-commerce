import { User } from "../models/user.models.js";
import bcrypt from "bcrypt"
import { getUserIdFromToken, generateToken } from "../middlewares/jwtProvider.js"
import { findUserByEmail } from "../services/user.service.js";

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
            res.send({ msg: "user email address is already used" })
        } else {
            const user = await new User(items);
            const pass = await bcrypt.hash(password, 10);
            user.password = pass;
            const token = generateToken(user._id);
            await user.save();
            res.status(200).send({ msg: "user created successfully", token: token })
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const items = {
        email,
        password
    }
    try {
        if (items) {
            const user = await findUserByEmail(email)
            if(user){
                const isPassValid = await bcrypt.compare(password, user.password)
                if(isPassValid){
                    const token = generateToken(user._id)
                    return res.status(200).send({ msg: "user login successfully", token })
                }else{
                    return res.status(401).send({ msg: "user password doesn't match" })
                }
            }else{
               return res.status(404).send({ msg: "user not exits" })
            }
        }else{
            res.status(400)
        } 
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}


const getUserDetailsByToken = async (req, res) => {
    const userId = getUserIdFromToken(req.body.token)
}

export { createUser, loginUser, getUserDetailsByToken }