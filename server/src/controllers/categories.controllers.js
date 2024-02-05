import { getTopLevelCategory, getThirdLevelCategory, getSecondLevelCategory } from "../services/categories.service.js";

export const getTopLevelCategoryController = async (req, res) => {
    try {
        const topLevel = await getTopLevelCategory(req);
        return res.status(200).send(topLevel);
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const getSecondLevelCategoryController = async (req, res) => {
    try {
        const secondLevel = await getSecondLevelCategory(req);
        return res.status(200).send(secondLevel);
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const getThirdLevelCategoryController = async (req, res) => {
    try {
        const thirdLevel = await getThirdLevelCategory(req);
        return res.status(200).send(thirdLevel);
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}