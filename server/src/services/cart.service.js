import { Cart } from "../models/cart.models.js"
import { CartItem } from "../models/cartItem.models.js"
import { Product } from "../models/product.models.js"

export const createCart = async (user) => {
    try {
        const cart = await new Cart({ user });
        const createdCart = await cart.save();
        return createdCart;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const findUserCart = async (userId) => {
    try {
        let cart = await Cart.findById(userId)
        // let cart = await Cart.findOne({ user: user })
        let cartItems = await CartItem.find({ cart: cart._id }).populate("Product");
        await cart.cartItem === cartItems;

        let totalPrice = 0;
        let totalItems = 0;
        let totalDiscountedPrice = 0;

        for (let cartItem of cart.cartItem) {
            totalPrice += cartItem.price;
            totalItems += cartItem.quantity;
            totalDiscountedPrice += cartItem.discountedPrice;
        }

        await cart.price === totalPrice;
        await cart.quantity === totalItems;
        await cart.discountedPrice === totalPrice - totalDiscountedPrice;

        return cart;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const addCartItem = async (userId, req) => {
    try {
        let cart = await Cart.findById(userId)
        let product = await Product.findById(req.productId)

        let isPresentCartItem = await CartItem.findOne({ userId, product: product._id, cart: cart._id })
        if (!isPresentCartItem) {
            const cartItem = new CartItem({
                product: product._id,
                cart: cart._id,
                userId,
                quantity: 1,
                discountedPrice: product.discountPrice,
                price: product.price,
                size: req.size
            })

            const createdCartItem = await cartItem.save();
            await cart.cartItem.push(createdCartItem);
            await cart.save();
            return "Item added to cart";
        }
    } catch (error) {
        throw new Error(error.message)
    }
}