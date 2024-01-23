import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { createRatingController, getAllRatingController } from "../controllers/rating.controllers.js";
const ratingRouter = express.Router()

ratingRouter
    .post("/create", authenticate, createRatingController)
    .get("/product/:productId", authenticate, getAllRatingController)

export { ratingRouter };