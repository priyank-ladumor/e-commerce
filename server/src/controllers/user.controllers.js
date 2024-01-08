import { User } from "../models/user.models.js";

const createUser = async (req,res) => {
    // const user = new User(req.body);
    res.send("hello")
}

export {createUser}