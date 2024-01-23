import express from "express"
import { authenticate } from "../middlewares/authenticate";
import { addItemToCartController, findUserCartController } from "../controllers/cart.controllers";
const cartRouter = express.Router()

cartRouter
    .get("/", authenticate, findUserCartController)
    .put("/add", authenticate, addItemToCartController)

export { cartRouter };