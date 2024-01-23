import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { cancelOrderController, confirmOrderController, deleteOrderController, deliverOrderController, getAllOrderController, shipOrderController } from "../controllers/adminOrder.controllers.js";
const adminOrderRouter = express.Router()

adminOrderRouter
   .get("/", authenticate, getAllOrderController)
   .put("/:orderId/confirmed", authenticate, confirmOrderController)
   .put("/:orderId/ship", authenticate, shipOrderController)
   .put("/:orderId/deliver", authenticate, deliverOrderController)
   .put("/:orderId/cancel", authenticate, cancelOrderController)
   .put("/:orderId/delete", authenticate, deleteOrderController)

export { adminOrderRouter };