import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { findProductByIdController, getAllProductController } from "../controllers/product.controllers.js";
const productRouter = express.Router()

productRouter
    .get("/", authenticate, getAllProductController)
    .get("/id/:id", authenticate, findProductByIdController)

export { productRouter };