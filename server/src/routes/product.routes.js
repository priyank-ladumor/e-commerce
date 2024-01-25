import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { findProductByIdController, getAllProductController } from "../controllers/product.controllers.js";
const productRouter = express.Router()

productRouter
    .get("/", getAllProductController)
    .get("/id/:id", findProductByIdController)

export { productRouter };