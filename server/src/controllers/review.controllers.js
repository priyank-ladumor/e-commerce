import { createReview, getAllReview } from "../services/review.service.js"

export const createReviewController = async (req, res) => {
    const user = req.user;
    try {
        const createRvw = await createReview(user, req.body)
        return res.status(201).send(createRvw);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const getAllReviewReviewController = async (req, res) => {
    const user = req.user;
    const productId = req.params.productId;
    try {
        const Review = await getAllReview(productId)
        return res.status(200).send(Review);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}