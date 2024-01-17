import express from "express"
import { createUser, getUserProfile, loginUser, userEmailVerifiedByToken, getAllUserProfile } from "../controllers/user.controllers.js"
const userRouter = express.Router()

userRouter
    .post("/signup", createUser)
    .post("/signin", loginUser)
    .post("/:token", userEmailVerifiedByToken)
    .get("/", getUserProfile)
    .get("/all", getAllUserProfile)

export { userRouter };