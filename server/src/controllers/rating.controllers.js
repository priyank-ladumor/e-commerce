import { createRating, getProductRating } from "../services/rating.service.js"

export const createRatingController = async (req, res) => {
    const user = req.user;
    try {
        const createRtg = await createRating(user, req.body)
        return res.status(201).send(createRtg);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const getAllRatingController = async (req, res) => {
    const user = req.user;
    const productId = req.params.productId;
    try {
        const rating = await getProductRating(productId)
        return res.status(200).send(rating);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}