import express from "express"
// import { authenticate } from "../middlewares/authenticate.js";
import { createSizeLabelController, createSizeOptionController, deleteLabelAndOptionController, deleteSizeOptionController, getSizeController, updateSizeOptionController } from "../controllers/size.controllers.js";
const sizeRouter = express.Router()

sizeRouter
    .post("/label", createSizeLabelController)
    .post("/option", createSizeOptionController)
    .delete("/option", deleteSizeOptionController)
    .delete("/lableandoption", deleteLabelAndOptionController)
    .get("/", getSizeController)
    .post("/update", updateSizeOptionController)

export { sizeRouter };