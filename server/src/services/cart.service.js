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
        let cart = await Cart.find({ user: userId }).populate({
            path: "cartItem", model: CartItem, populate: {
                path: "product", model: Product
            }
        });

        let totalPrice = 0;
        let totalItems = 0;
        let totalDiscountedPrice = 0;

        for (let cartItem of cart[0].cartItem) {
            totalPrice += cartItem.price;
            totalItems += cartItem.quantity;
            totalDiscountedPrice += cartItem.discountedPrice;
        }
        // cart.totalPrice = totalPrice;
        // cart.totalItem = totalItems;
        // cart.totalDiscountedPrice = totalPrice - totalDiscountedPrice;

        let cartUpdate = await Cart.findOneAndUpdate({ user: userId }, { totalPrice: totalPrice, totalDiscountedPrice: totalDiscountedPrice, totalItem: totalItems }, { new: true })
            .populate({
                path: "cartItem", model: CartItem, populate: {
                    path: "product", model: Product
                }
            });
        return cartUpdate;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const addCartItem = async (userId, req) => {
    try {
        let cart = await Cart.find({ user: userId })
        let product = await Product.findById(req.productId)
        let isPresentCartItem = await CartItem.findOne({ user: userId, product: product._id, cart: cart[0]._id });
        if (!isPresentCartItem) {
            const cartItem = new CartItem({
                product: product._id,
                cart: cart[0]._id,
                user: userId,
                quantity: 1,
                discountedPrice: product.discountPrice,
                price: product.price,
                size: req.size
            })
            const createdCartItem = await cartItem.save();
            const addToCart = await Cart.findOneAndUpdate({ user: userId }, { $push: { cartItem: createdCartItem } }, { new: true })
            // await cart[0].cartItem.push(createdCartItem);
            // await cart.save();
            await addToCart.save();
            return "Item added to cart";
        }
        if (isPresentCartItem) {
            return "Item already added to cart";
        }
    } catch (error) {
        throw new Error(error.message)
    }
}