import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { createMultipleProdController, createProductController, deleteProductController, updateProductController } from "../controllers/product.controllers.js";
const adminProductRouter = express.Router()
import { upload } from "../multer/multer.js";

adminProductRouter
    .post("/", upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]), authenticate, createProductController)
    .post("/creates", authenticate, createMultipleProdController)
    .delete("/:id", authenticate, deleteProductController)
    .put("/:id", authenticate, updateProductController)

export { adminProductRouter };