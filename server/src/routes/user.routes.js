import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { createUser, getUserProfile, loginUser, userEmailVerifiedByToken, getAllUserProfile, getUserRole } from "../controllers/user.controllers.js"
const userRouter = express.Router()

userRouter
    .post("/signup", createUser)
    .post("/signin", loginUser)
    .post("/:token", userEmailVerifiedByToken)
    .get("/", getUserProfile)
    .get("/role", authenticate, getUserRole)
    .get("/all", getAllUserProfile)

export { userRouter };