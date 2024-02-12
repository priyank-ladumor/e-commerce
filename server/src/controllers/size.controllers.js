import { createSizeLabel, createSizeOption, deleteLabelAndOption, deleteSizeOption, getSize, updateSizeOption } from "../services/size.service.js";

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
    console.log(req.body);
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
        await deleteSizeOption(label, option);
        res.status(201).send({ msg: `${option} deleted successfully` });

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const updateSizeOptionController = async (req, res) => {
    const { label, option, newOption } = req.body;
    try {
        await updateSizeOption(label, option, newOption);
        res.status(201).send({ msg: `${option} updated to ${newOption}` });

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const deleteLabelAndOptionController = async (req, res) => {
    const { label } = req.body;
    try {
        await deleteLabelAndOption(label);
        res.status(201).send({ msg: `${label} deleted successfully` });

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const getSizeController = async (req, res) => {
    try {
        const size = await getSize();
        res.status(200).send(size);

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}