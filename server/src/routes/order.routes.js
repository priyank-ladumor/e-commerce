
import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { CancelOrderController, checkProductQuantityAvailableController, createOrderController, findAllUserOrderController, findOrderByIdController, orderHistoryController, removeOrderController } from "../controllers/order.controllers.js";
const orderRouter = express.Router()

orderRouter
    .post("/", authenticate, createOrderController)
    .get("/", authenticate, findAllUserOrderController)
    .get("/:id", authenticate, findOrderByIdController)
    .get("/cancel/:orderId", authenticate, CancelOrderController)
    .delete("/delete/:orderId", authenticate, removeOrderController)
    .post("/check/product_quantity", checkProductQuantityAvailableController)

export { orderRouter };