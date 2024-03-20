import { Address } from "../models/address.models.js"
import { Order } from "../models/order.models.js"
import { OrderItem } from "../models/orderItem.models.js"
import { CartItem } from "../models/cartItem.models.js"
import { Product } from "../models/product.models.js"
import { User } from "../models/user.models.js"
import { Cart } from "../models/cart.models.js"
import { deleteCartItem, findCartItemById } from "./cartItem.service.js"
import { findProductById } from "./product.service.js"

export const checkProductQuantityAvailable = async (body) => {
    const { pid, quantity, color, size } = body;
    if (pid && quantity && color && size) {
        const product = await Product?.findOne({ _id: pid });
        const matchSizeAndColor = product && product?.sizesAndColor.filter((ele) => ele.size === size && ele.color === color)
        if (matchSizeAndColor[0]?.quantity >= quantity) {
            return "quantity available"
        } else {
            return { msg: `This size: ${size} and title: ${product.title} has ${matchSizeAndColor[0].quantity} quantity left` }
        }
    } else {
        throw new Error('body data not received');
    }
}


export const createOrder = async (user, body) => {
    const { selectedAddress, paymentSys, cartId, cartItemDetails } = body;

    if (cartItemDetails?.length === 0) {
        throw new Error("cart items not found");
    }
    //for validate quantity available in product or not
    const validate = cartItemDetails && cartItemDetails?.map((ele) => checkProductQuantityAvailable(ele));
    const address = await Address.findById(selectedAddress);

    let cart = await Cart.findById({ _id: cartId }).populate({
        path: "cartItem", model: CartItem, populate: {
            path: "product", model: Product
        }
    })

    const OrderItems = [];
    let qunatityNotAvailable = [];
    const validationResults = await Promise.all(validate);
    const isValid = validationResults && validationResults?.map((ele) => ele.msg?.length > 0 && qunatityNotAvailable.push(ele.msg))

    if (qunatityNotAvailable[0]) {
        throw new Error(qunatityNotAvailable[0]);
    } else {
        for (const item of cart.cartItem) {
            const orderItemCreate = new OrderItem({
                product: item.product,
                user: item.user,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.price
            })

            const createdOrderItem = await orderItemCreate.save();
            await OrderItems.push(createdOrderItem);
        }

        const createdOrder = new Order({
            shippingAddress: address,
            totalPrice: cart.totalPrice,
            orderItem: OrderItems,
            totalItem: cart.totalItem,
            user: cart.user,
        })
        createdOrder.paymentDetails.paymentMethod = paymentSys;
        const savedOrder = await createdOrder.save();

        const delCartItem = cart?.cartItem?.map((ele) => ele._id);
        for (let id of delCartItem) {
            const findCartItem = await findCartItemById(id);
            const product = await findProductById(findCartItem?.product[0]?._id)
            product.quantity = product.quantity - findCartItem?.quantity;
            const updateQuantityId = product.sizesAndColor?.filter((ele) =>
                ele.size === findCartItem?.size && ele.color === findCartItem?.color
            )
            const QuantityUpdate =
                //for updating product quantity
                await Product.updateOne({
                    _id: findCartItem?.product[0]?._id,
                    "sizesAndColor._id": updateQuantityId[0]?._id,
                }, {
                    $set: {
                        'sizesAndColor.$.quantity': updateQuantityId[0]?.quantity - findCartItem?.quantity,
                    }
                })
            await product.save();
            //for  delete the Cart Item from User's Shopping
            const del = await deleteCartItem(id)
        }
        //for delete the user cart
        await Cart.findByIdAndDelete(cartId)

        if (savedOrder) {
            return "Order Created Successfully";
        }
    }


}


export const findOrderById = async (orderId) => {
    const order = await Order.findById(orderId)
        .populate("user")
        .populate("shippingAddress")
        .populate({ path: "OrderItem", populate: { path: "Product" } })

    return order;
}

export const placeOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "PLACED";
    order.paymentDetails.paymentStatus = "COMPLETED";

    return await order.save()
}

export const confirmOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "CONFIRM";
    return await order.save()
}

export const shipOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "SHIPPED";
    return await order.save()
}

export const deliverOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "DELIVERED";
    return await order.save()
}

export const cancelOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "CANCELLED";
    return await order.save()
}

export const userOrderHistory = async (userId) => {
    try {
        const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
            .populate({ path: "OrderItem", populate: { path: "Product" } }).lean()

        return orders;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getAllOrder = async () => {
    return await Order.find()
        .populate({ path: "OrderItem", populate: { path: "Product" } }).lean()
}

export const deleteOrder = async (orderId) => {
    const order = await findOrderById(orderId);
    await Order.findByIdAndDelete(order._id)
}


