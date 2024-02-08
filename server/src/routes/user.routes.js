import express from "express"
import { getAllUserProfiles } from "../controllers/user.controllers.js"
import { authenticate } from "../middlewares/authenticate.js";
import { createUser, getUserProfile, loginUser, userEmailVerifiedByToken, getUserRole } from "../controllers/user.controllers.js"
const userRouter = express.Router()

userRouter
    .post("/signup", createUser)
    .post("/signin", loginUser)
    .post("/:token", userEmailVerifiedByToken)
    .get("/all", getAllUserProfiles)
    .get("/", getUserProfile)
    .get("/role", authenticate, getUserRole)

export { userRouter };