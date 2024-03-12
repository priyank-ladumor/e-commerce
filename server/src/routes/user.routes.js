import express from "express"
import { getAllUserProfiles, userDeleteByIdController, userBannedByIdController, userActiveByIdController, userProfileUpdateController, resetPasswordController } from "../controllers/user.controllers.js"
import { authenticate } from "../middlewares/authenticate.js";
import { createUser, getUserProfile, loginUser, userEmailVerifiedByToken } from "../controllers/user.controllers.js"
const userRouter = express.Router()
import { upload } from "../multer/multer.js";


userRouter.post("/signup", createUser)
    .post("/signin", loginUser)
    .post("/:token", userEmailVerifiedByToken)
    .get("/all", getAllUserProfiles)
    .delete("/:id", userDeleteByIdController)
    .get("/:id", userBannedByIdController)
    .get("/unbanned/:id", userActiveByIdController)
    .get("/", authenticate, getUserProfile)
    .put("/update", authenticate,
        upload.fields([{ name: 'profileImg', maxCount: 1 }]), userProfileUpdateController)
    .put("/reset-password/:id", authenticate, resetPasswordController)

export { userRouter };