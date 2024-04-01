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
        .populate({
            path: "orderItem", model: OrderItem, populate: {
                path: "product", model: Product
            }
        })
    return order;
}

export const findAllOrder = async () => {
    const findOrder = await Order.find().populate("shippingAddress").populate({
        path: "orderItem", model: OrderItem, populate: {
            path: "product", model: Product
        }
    })

    return findOrder;
}

export const findAllUserOrder = async (userId) => {
    const findAllOrder = await Order.find({ user: userId }).populate({
        path: "orderItem", model: OrderItem, populate: {
            path: "product", model: Product
        }
    })

    return findAllOrder;
}


export const confirmOrder = async (orderId) => {
    const order = await findOrderById(orderId);
    
    order.orderStatus = "Confirmed";
    await order.save()
    return "Order Confirmed Successfully"
}

export const packedOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "Packed";
    await order.save()
    return "Order Packed Successfully"
}

export const shipOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "Shipped";
    await order.save()
    return "Order Shipped Successfully"
}

export const deliverOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    order.orderStatus = "Delivered";
    order.paymentDetails.paymentStatus = "COMPLETED"
    order.deliveredDate = new Date();
    await order.save()
    return "Order Delivered Successfully"
}

export const removeOrder = async (orderId) => {
    const order = await Order.findById(orderId);
    for (let id of order.orderItem) {
        await OrderItem.findByIdAndDelete(id);
    }
    await Order.findByIdAndDelete(orderId);

    if (order) {
        return "Order removed successfully"
    } else {
        return "Unable to remove the order"
    }
}

export const cancelOrder = async (user, orderId) => {
    const order = await findOrderById(orderId);
    const sizesAndColorID = order.orderItem[0].product[0]?.sizesAndColor.filter((item) => item.size === order.orderItem[0]?.size && item.color === order.orderItem[0]?.color)

    await Product.updateOne({
        _id: order.orderItem[0]?.product[0]?._id,
        "sizesAndColor._id": sizesAndColorID[0]._id,
    }, {
        $set: {
            'sizesAndColor.$.quantity': sizesAndColorID[0]?.quantity + order.orderItem[0]?.quantity,
        }
    })

    order.paymentDetails.paymentStatus = "CANCELLED"
    order.orderStatus = "CANCELLED";
    order.deliveredDate = "";
    await order.save()
    await Product.updateOne({ _id: order.orderItem[0]?.product[0]?._id }, { quantity: order.orderItem[0]?.product[0].quantity + order.orderItem[0]?.quantity })
    return "Order Successfully Canceled"
}

export const userOrderHistory = async (userId) => {
    const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
        .populate({ path: "OrderItem", populate: { path: "Product" } }).lean()

    return orders;
}

export const getAllOrder = async () => {
    return await Order.find()
        .populate({ path: "OrderItem", populate: { path: "Product" } }).lean()
}



