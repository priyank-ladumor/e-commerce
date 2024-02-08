import express from "express"
import { getAllUserProfiles, userDeleteByIdController, userBannedByIdController, userActiveByIdController } from "../controllers/user.controllers.js"
import { authenticate } from "../middlewares/authenticate.js";
import { createUser, getUserProfile, loginUser, userEmailVerifiedByToken } from "../controllers/user.controllers.js"
const userRouter = express.Router()

userRouter.post("/signup", createUser)
    .post("/signin", loginUser)
    .post("/:token", userEmailVerifiedByToken)
    .get("/all", getAllUserProfiles)
    .delete("/:id", userDeleteByIdController)
    .get("/:id", userBannedByIdController)
    .get("/unbanned/:id", userActiveByIdController).get("/", authenticate, getUserProfile)

export { userRouter };