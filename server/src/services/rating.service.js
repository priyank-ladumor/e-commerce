import { findProductById } from "./product.service.js"
import { Rating } from "../models/rating.models.js"

export const createRating = async (req, user) => {
    const product = await findProductById(req.productId);

    const rating = new Rating({
        product: product._id,
        user: user._id,
        rating: req.rating,
        createdAt: new Date()
    })

    return await rating.save();
}

export const getProductRating = async (productId) => {
    return await Rating.find({product: productId});
}

