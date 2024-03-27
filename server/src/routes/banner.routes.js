import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { AddBannerController } from "../controllers/BannerAndLogo.js";
const bannerRouter = express.Router()
import { upload } from "../multer/multer.js";

bannerRouter
    .post("/", authenticate, upload.fields([{ name: 'BannerImgs', maxCount: 10 }]), AddBannerController)

export { bannerRouter };