import { confirmOrder, getAllOrder, shipOrder } from "../services/order.service.js"

export const getAllOrderController = async (req, res) => {
    try {
        const order = await getAllOrder();
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}

export const confirmOrderController = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await confirmOrder(orderId);
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}

export const shippOrderController = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await shipOrder(orderId);
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}