import express from "express"
import { authenticate } from "../middlewares/authenticate";
import { findProductByIdController, getAllProductController } from "../controllers/product.controllers";
const productRouter = express.Router()

productRouter
    .get("/", authenticate, getAllProductController)
    .get("/id/:id", authenticate, findProductByIdController)

export { productRouter };