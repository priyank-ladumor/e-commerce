import { findUserById } from "../services/user.service.js"
import { Cart } from "../models/cart.models.js"
import { CartItem } from "../models/cartItem.models.js"
import { Product } from "../models/product.models.js"


export const findCartItemById = async (cartItemId) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
}

export const updateCartItem = async (userId, cartItemId, cartItemData) => {
    try {
        const item = await findCartItemById(cartItemId);
        if (!item) {
            throw new Error("cart item not found", cartItemId)
        }
        const user = await findUserById(item.userId);
        if (!user) {
            throw new Error("user not found", userId)
        }

        if (user._id.toString() === userId.toString()) {
            item.quantity = cartItemData.quantity;
            item.price = item.quantity * item.product.price;
            item.discountedPrice = item.quantity * item.product.discountedPrice;
            const updatedCartItem = await item.save();
            return updateCartItem;
        } else {
            throw new Error("you can`t update this cart item")
        }

    } catch (error) {
        throw new Error(error.message)
    }
}


export const removeCartItem = async (userId, cartItemId) => {
    try {
        const cartItem = await findCartItemById(cartItemId);
        const user = await findUserById(userId);

        if (user._id.toString() === cartItem.userId.toString()) {
            await CartItem.findByIdAndDelete(cartItemId)
        } else {
            throw new Error("you can`t remove another user items")
        }

    } catch (error) {
        throw new Error(error.message)
    }
}