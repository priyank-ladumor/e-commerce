
import express from "express"
import { authenticate } from "../middlewares/authenticate";
import { createOrderController, findOrderByIdController, orderHistoryController } from "../controllers/order.controllers";
const orderRouter = express.Router()

orderRouter
    .post("/", authenticate, createOrderController)
    .get("/", authenticate, orderHistoryController)
    .get("/:id", authenticate, findOrderByIdController)

export { orderRouter };