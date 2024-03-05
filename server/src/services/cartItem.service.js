import { findUserById } from "../services/user.service.js"
import { Cart } from "../models/cart.models.js"
import { CartItem } from "../models/cartItem.models.js"
import { Product } from "../models/product.models.js"


export const findCartItemById = async (cartItemId) => {
    try {
        const cartItem = await CartItem.findOne({ cart: cartItemId }).populate({ path: "product", model: Product })
        if (cartItem) {
            return cartItem;
        } else {
            throw new Error("cartItem not found")
        }
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

        const user = await findUserById(item.user);
        if (!user) {
            throw new Error("user not found", userId)
        }
        console.log(user, "u");
        if (user._id.toString() === userId.toString()) {
            item.quantity = cartItemData.quantity;
            item.price = item.quantity * item.product[0].price;
            item.discountedPrice = item.quantity * item.product[0].discountPrice;
            const updatedCartItem = await item.save();
            await Cart.findOneAndUpdate({ user: userId }, { totalPrice: item.price, totalDiscountedPrice: item.discountedPrice, totalItem: item.quantity }, { new: true })
            return updatedCartItem;
        } else {
            throw new Error("you can`t update this cart item")
        }

    } catch (error) {
        throw new Error(error.message)
    }
}


export const removeCartItem = async (userId, cartItemId, size, color) => {
    try {
        const cartItem = await CartItem.findOne({_id: cartItemId, size: size, color: "#" + color});
        if (!cartItem) {
            throw new Error("no cartitem availble on this id")
        }
        const user = await findUserById(userId);
        if (user._id.toString() === cartItem.user.toString()) {
            const userCartItems = await Cart.findOne({ user: userId });
            userCartItems.totalItem = userCartItems.totalItem - 1;
            userCartItems.totalPrice = userCartItems.totalPrice - cartItem.price;
            userCartItems.save();
            await CartItem.findByIdAndDelete(cartItemId)
            await Cart.updateOne({ user: userId }, { $pull: { cartItem: cartItemId } })
            return "Cart item removed successfully"
        } else {
            throw new Error("you can`t remove another user items")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}