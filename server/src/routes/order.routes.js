
import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { CancelOrderController, checkProductQuantityAvailableController, confirmOrderController, createOrderController, deliverOrderController, findAllOrderController, findAllUserOrderController, findOrderByIdController, onlinePaymentSuccessController, packedOrderController, removeOrderController, shipOrderController } from "../controllers/order.controllers.js";
const orderRouter = express.Router()

orderRouter
    .post("/", authenticate, createOrderController)
    .post("/payment/success", authenticate, onlinePaymentSuccessController)
    .get("/", authenticate, findAllUserOrderController)
    .get("/all", findAllOrderController)
    .get("/:id", authenticate, findOrderByIdController)
    .get("/confirm/:id", authenticate, confirmOrderController)
    .get("/cancel/:orderId", authenticate, CancelOrderController)
    .get("/packed/:id", authenticate, packedOrderController)
    .get("/shipped/:id", authenticate, shipOrderController)
    .get("/delivered/:id", authenticate, deliverOrderController)
    .delete("/delete/:orderId", authenticate, removeOrderController)
    .post("/check/product_quantity", checkProductQuantityAvailableController)

export { orderRouter };