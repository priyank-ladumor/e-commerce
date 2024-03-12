import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { createAddressController, deleteAddressController, getUserAddressController } from "../controllers/address.controllers.js";
const addressRouter = express.Router()

addressRouter
    .post("/", authenticate, createAddressController)
    .delete("/:id", authenticate, deleteAddressController)
    .get("/:id", authenticate, getUserAddressController)

export { addressRouter };