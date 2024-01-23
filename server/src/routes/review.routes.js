import express from "express"
import { authenticate } from "../middlewares/authenticate.js";
import { createReviewController, getAllReviewReviewController } from "../controllers/review.controllers.js";
const reviewRouter = express.Router()

reviewRouter
    .post("/create", authenticate, createReviewController)
    .get("/product/:productId", authenticate, getAllReviewReviewController)

export { reviewRouter };