import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { findProductByIdController, getAllProductController, getKidsProductsController, getMenProductsController, getWomenProductsController } from "../controllers/product.controllers.js";
const productRouter = express.Router()

productRouter
    .get("/", getAllProductController)
    .get("/id/:id", findProductByIdController)
    .get("/men", getMenProductsController)
    .get("/women", getWomenProductsController)
    .get("/kids", getKidsProductsController)

export { productRouter };