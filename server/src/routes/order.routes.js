
import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { CancelOrderController, checkProductQuantityAvailableController, createOrderController, findAllUserOrderController, findOrderByIdController, orderHistoryController } from "../controllers/order.controllers.js";
const orderRouter = express.Router()

orderRouter
    .post("/", authenticate, createOrderController)
    .get("/", authenticate, findAllUserOrderController)
    .get("/:id", authenticate, findOrderByIdController)
    .post("/cancel/:orderId", authenticate, CancelOrderController)
    .post("/check/product_quantity", checkProductQuantityAvailableController)

export { orderRouter };