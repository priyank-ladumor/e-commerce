import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { addItemToCartController, findUserCartController } from "../controllers/cart.controllers.js";
const cartRouter = express.Router()

cartRouter
    .get("/", authenticate, findUserCartController)
    .put("/add", authenticate, addItemToCartController)

export { cartRouter };