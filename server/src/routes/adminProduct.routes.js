import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { createMultipleProdController, createProductController, deleteProductController, updateProductController } from "../controllers/product.controllers.js";
const adminProductRouter = express.Router()

adminProductRouter
    .post("/", authenticate, createProductController)
    .post("/creates", authenticate, createMultipleProdController)
    .delete("/:id", authenticate, deleteProductController)
    .put("/:id", authenticate, updateProductController)

export { adminProductRouter };