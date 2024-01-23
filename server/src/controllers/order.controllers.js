import { createOrder, findOrderById, userOrderHistory } from "../services/order.service";

export const createOrderController = async (req, res) => {
    const user = req.user;
    try {
        const createOrderr = await createOrder(user, req.body)
        return res.status(201).send(createOrderr);
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