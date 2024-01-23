import { removeCartItem, updateCartItem } from "../services/cartItem.service.js"

export const updateCartItemController = async (req, res) => {
    const user = req.user;
    try {
        const updatedCartItem = await updateCartItem(user._id, req.params.id, req.body)
        return res.status(200).send(updatedCartItem);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const removeCartItemController = async (req, res) => {
    const user = req.user;
    try {
        await removeCartItem(user._id, req.params.id)
        return res.status(200).send({ msg: "cart item remove successfully" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}