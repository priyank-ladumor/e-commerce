import { Address } from "../models/address.models.js";
import { findUserById } from "./user.service.js";



export const createAddress = async (req) => {
    const { phone, zipCode, state, city, streetAddress, lastName, firstName } = req.body;

    const user = req.user;
    if (user) {
        const createAddress = new Address({
            user: user._id,
            phone,
            zipCode,
            city,
            state,
            streetAddress,
            lastName,
            firstName
        })
        await createAddress.save();
        return createAddress;
    } else {
        throw new Error('User not found');
    }
}

export const deleteAddress = async (req) => {
    const { id } = req.params;
    const user = req.user;
    if (id) {
        const address = await Address.findById(id)
        if (user._id.toString() === address.user.toString()) {
            const deleteAdd = await Address.findByIdAndDelete(id)
            return deleteAdd;
        } else {
            throw new Error('invalid token');
        }
    } else {
        throw new Error('id not found');
    }
}

export const getUserAddress = async (req) => {
    const { id } = req.params;
    const user = req.user;

    if (id) {
        const address = await Address.find();
        if (user?._id.toString() === id.toString()) {
            const findUserAddress = address?.filter((ele) => ele.user[0].toString() === user._id.toString())
            return findUserAddress;
        } else {
            throw new Error('invalid token');
        }
    } else {
        throw new Error('id not found');
    }
}