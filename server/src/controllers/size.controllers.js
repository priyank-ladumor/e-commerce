import { createSizeLabel, createSizeOption, deleteSizeOption } from "../services/size.service.js";

export const createSizeLabelController = async (req, res) => {
    const { label } = req.body;
    try {
        if (label) {
            await createSizeLabel(label)
            res.status(201).send({ msg: `${label} has been created successfully` });
        } else {
            return res.status(400).json({ error: 'Label is required' });
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const createSizeOptionController = async (req, res) => {
    const { label, option } = req.body;
    try {
        if (label && option) {
            await createSizeOption(label, option);
            res.status(201).send({ msg: `${option} has been created successfully` });
        } else {
            return res.status(400).json({ error: 'Label and option is required' });
        }
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const deleteSizeOptionController = async (req, res) => {
    const { label, option } = req.body;
    try {
       const deleteOption = await deleteSizeOption(label, option);
       console.log(deleteOption,"deleteOption");
        res.status(201).send({ msg: `${option} deleted successfully` });

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}