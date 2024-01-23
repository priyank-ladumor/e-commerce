import express from "express"
import { authenticate } from "../middlewares/authenticate";
import { cancelOrderController, confirmOrderController, deleteOrderController, deliverOrderController, getAllOrderController, shipOrderController } from "../controllers/adminOrder.controllers";
const adminOrderRouter = express.Router()

adminOrderRouter
   .get("/", authenticate, getAllOrderController)
   .put("/:orderId/confirmed", authenticate, confirmOrderController)
   .put("/:orderId/ship", authenticate, shipOrderController)
   .put("/:orderId/deliver", authenticate, deliverOrderController)
   .put("/:orderId/cancel", authenticate, cancelOrderController)
   .put("/:orderId/delete", authenticate, deleteOrderController)

export { adminOrderRouter };