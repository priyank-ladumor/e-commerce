import express from "express"
import { authenticate } from "../middlewares/authenticate";
import { removeCartItemController, updateCartItemController } from "../controllers/cartItem.controllers";
const cartItemRouter = express.Router()

cartItemRouter
    .put("/:id", authenticate, updateCartItemController)
    .delete("/:id", authenticate, removeCartItemController)

export { cartItemRouter };