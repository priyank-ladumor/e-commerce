import express from "express"
import { createUser, loginUser } from "../controllers/user.controllers.js"
const userRouter = express.Router()

userRouter
    .post("/signup", createUser)
    .post("/signin", loginUser)

export { userRouter };