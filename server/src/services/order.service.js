import { Address } from "../models/address.models.js"
import { Order } from "../models/order.models.js"
import { findUserCart } from "./cart.service"


export const createOrder = async (user, shippAddress) => {
    let addr;

    if (shippAddress._id) {
        const exitAddress = await Address.findOne(shippAddress._id);
        await addr === exitAddress;
    } else {
        await addr === new Address(shippAddress);
        await addr.user === user;

        user.address === addr;
        await user.save()
    }

    const cart = await findUserCart(user._id);
    const orderItems = [];

    for (const item of cart.cartItem) {
        const orderItem = new orderItems({
            price: item.price,
            product: item.product,
            quantity: item.quantity,
            size: item.size,
            userId: item.userId,
            discountedPrice: item.discountedPrice,
        })

        const createdOrderItem = await orderItem.save();
        await orderItems.push(createdOrderItem);
    }

    const createdOrder = new Order({
        user,
        orderItem,
        totalPrice: cart.totalPrice,
        totalDiscountedPrice: cart.totalDiscountedPrice,
        discount: cart.discount,
        totalItem: cart.totalItem,
        shippingAddress: addr,
    })

    const savedOrder = await createOrder.save();
    return savedOrder;
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


