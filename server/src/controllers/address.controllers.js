import { createAddress, deleteAddress } from "../services/address.service.js";

export const createAddressController = async (req, res) => {
    try {
        const addressCreate = await createAddress(req)
        if(addressCreate){
            return res.status(201).send({msg: "Address created successfully"})
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const deleteAdd = await deleteAddress(req)
        if(deleteAdd){
            return res.status(201).send({msg: "Address deleted successfully"})
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}