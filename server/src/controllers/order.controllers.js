import { cancelOrder, checkProductQuantityAvailable, createOrder, findAllUserOrder, findOrderById, removeOrder, userOrderHistory } from "../services/order.service.js";

export const createOrderController = async (req, res) => {
    const user = req.user;
    try {
        const createOrderr = await createOrder(user, req.body)
        return res.status(201).send(createOrderr);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const CancelOrderController = async (req, res) => {
    const user = req.user;
    const { orderId } = req.params;
    try {
        const cncelOrder = await cancelOrder(user,orderId)
        return res.status(201).send(cncelOrder);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const removeOrderController = async (req, res) => {
    const { orderId } = req.params;
    try {
        const rmvOrder = await removeOrder(orderId)
        return res.status(201).send(rmvOrder);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const findAllUserOrderController = async (req, res) => {
    const user = req.user;
    try {
        const getAllUserOrder = await findAllUserOrder(user)
        return res.status(201).send(getAllUserOrder);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const findOrderByIdController = async (req, res) => {
    const user = req.user;
    try {
        const order = await findOrderById(req.params.id);
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const orderHistoryController = async (req, res) => {
    const user = req.user;
    try {
        const orderHis = await userOrderHistory(user._id);
        return res.status(200).send(orderHis);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const checkProductQuantityAvailableController = async (req, res) => {
    const user = req.user;
    try {
        const checkProductQuantity = await checkProductQuantityAvailable(req.body);
        return res.status(200).send(checkProductQuantity);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}