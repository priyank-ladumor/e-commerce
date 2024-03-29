import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { addLogoController, getLogoController } from "../controllers/BannerAndLogo.js";
const logoRouter = express.Router()
import { upload } from "../multer/multer.js";

logoRouter
    .post("/", authenticate, upload.fields([{ name: 'logo', maxCount: 1 }]), addLogoController)
    .get("/", getLogoController)

export { logoRouter };