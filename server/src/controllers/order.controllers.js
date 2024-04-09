import { cancelOrder, checkProductQuantityAvailable, confirmOrder, createOrder, deliverOrder, findAllOrder, findAllUserOrder, findOrderById, onlinePaymentSuccess, packedOrder, removeOrder, shipOrder, userOrderHistory } from "../services/order.service.js";

export const createOrderController = async (req, res) => {
    const user = req.user;
    try {
        const createOrderr = await createOrder(user, req.body)
        return res.status(201).send(createOrderr);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const onlinePaymentSuccessController = async (req, res) => {
    const user = req.user;
    try {
        const Orderr = await onlinePaymentSuccess(user, req.body.transactionId)
        return res.status(201).send(Orderr);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const CancelOrderController = async (req, res) => {
    const user = req.user;
    const { orderId } = req.params;
    try {
        const cncelOrder = await cancelOrder(user, orderId)
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

export const findAllOrderController = async (req, res) => {
    try {
        const getAllOrder = await findAllOrder()
        return res.status(201).send(getAllOrder);
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

export const confirmOrderController = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    try {
        const order = await confirmOrder(id);
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const packedOrderController = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    try {
        const order = await packedOrder(id);
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const shipOrderController = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    try {
        const order = await shipOrder(id);
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const deliverOrderController = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    try {
        const order = await deliverOrder(id);
        return res.status(200).send(order);
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