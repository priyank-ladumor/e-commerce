import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { AddBannerController, deleteBannerController, getAllBannerController } from "../controllers/BannerAndLogo.js";
const bannerRouter = express.Router()
import { upload } from "../multer/multer.js";

bannerRouter
    .post("/", authenticate, upload.fields([{ name: 'BannerImgs', maxCount: 10 }]), AddBannerController)
    .get("/", authenticate, getAllBannerController)
    .delete("/:url", authenticate, deleteBannerController)

export { bannerRouter };