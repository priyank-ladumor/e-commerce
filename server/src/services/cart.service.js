import { Cart } from "../models/cart.models.js"
import { CartItem } from "../models/cartItem.models.js"
import { Product } from "../models/product.models.js"

export const createCart = async (user) => {
    try {
        const cart = new Cart({ user });
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

        if(cart){
            return cart;
        }else{
            return "No User Cart Products"
        }

        // let totalPrice = 0;
        // let totalItems = 0;
        // let totalDiscountedPrice = 0;

        // for (let cartItem of cart[0].cartItem) {
        //     totalPrice += cartItem.price;
        //     totalItems += cartItem.quantity;
        //     totalDiscountedPrice += cartItem.discountedPrice;
        // }

        // let cartUpdate = await Cart.findOneAndUpdate({ user: userId }, { totalPrice: totalPrice, totalDiscountedPrice: totalDiscountedPrice, totalItem: totalItems }, { new: true })
        //     .populate({
        //         path: "cartItem", model: CartItem, populate: {
        //             path: "product", model: Product
        //         }
        //     });
        // return cartUpdate;

    } catch (error) {
        throw new Error(error.message)
    }
}

export const addCartItem = async (userId, req) => {
    try {
        let cart = await Cart.find({ user: userId })
        let product = await Product.findById(req.productId)
        if (cart.length === 0) {
            await createCart(userId);
        }
        const cartData = await Cart.findOne({ user: userId });
        let isPresentCartItem = await CartItem.findOne({ user: userId, product: product._id, cart: cartData._id, size: req.size, color: req.color });
        console.log(isPresentCartItem, "isPresentCartItem");
        if (!isPresentCartItem) {
            const cartItem = new CartItem({
                product: product._id,
                cart: cartData._id,
                user: userId,
                quantity: 1,
                price: product.discountPrice,
                size: req.size,
                color: req.color
            })
            const createdCartItem = await cartItem.save();
            const addToCart = await Cart.findOneAndUpdate({ user: userId }, { $push: { cartItem: createdCartItem } }, { new: true })
            addToCart.totalItem = addToCart.totalItem + 1;
            addToCart.totalPrice = addToCart.totalPrice + product.discountPrice;
            await addToCart.save();
            return "Item added to cart";
        }
        if (isPresentCartItem) {
            if (isPresentCartItem.size === req.size && isPresentCartItem.color === req.color) {
                throw new Error("Item already added to cart")
            } else {
                const cartItem = new CartItem({
                    product: product._id,
                    cart: cartData._id,
                    user: userId,
                    quantity: 1,
                    price: product.discountPrice,
                    size: req.size,
                    color: req.color
                })
                const createdCartItem = await cartItem.save();
                const addToCart = await Cart.findOneAndUpdate({ user: userId }, { $push: { cartItem: createdCartItem } }, { new: true })
                addToCart.totalItem = addToCart.totalItem + 1;
                addToCart.totalPrice = addToCart.totalPrice + product.discountPrice;
                await addToCart.save();
                return "Item added to cart";
            }
        }
    } catch (error) {
        throw new Error(error.message)
    }
}