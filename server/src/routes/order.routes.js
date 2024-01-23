
import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { createOrderController, findOrderByIdController, orderHistoryController } from "../controllers/order.controllers.js";
const orderRouter = express.Router()

orderRouter
    .post("/", authenticate, createOrderController)
    .get("/", authenticate, orderHistoryController)
    .get("/:id", authenticate, findOrderByIdController)

export { orderRouter };