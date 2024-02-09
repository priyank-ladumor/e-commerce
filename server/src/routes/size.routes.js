import express from "express"
// import { authenticate } from "../middlewares/authenticate.js";
import { createSizeLabelController, createSizeOptionController, deleteSizeOptionController } from "../controllers/size.controllers.js";
const sizeRouter = express.Router()

sizeRouter
    .post("/label", createSizeLabelController)
    .post("/option", createSizeOptionController)
    .delete("/option", deleteSizeOptionController)

export { sizeRouter };