import { getTopLevelCategory, getThirdLevelCategory, getSecondLevelCategory, delteCategoryById, EditCategoryById, createTopLvlCategory, createSecondLvlCategory, createThirdLvlCategory, getSearchCategory } from "../services/categories.service.js";

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

export const getSearchCategoryController = async (req, res) => {
    try {
        const search = await getSearchCategory(req);
        return res.status(200).send(search);
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const delteCategoryByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        await delteCategoryById(id);
        return res.status(202).send({ msg: "category successfully deleted" });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const EditCategoryByIdController = async (req, res) => {
    try {
        const updatedCategory = await EditCategoryById(req);
        if (!updatedCategory) {
            return res.status(400).send({ msg: "category updated failed" });
        }
        return res.status(200).send({ msg: "category updated successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const createTopLvlCategoryController = async (req, res) => {
    try {
        await createTopLvlCategory(req);
        return res.status(200).send({ msg: `${req.body.topCategory} category created successfully` });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const createSecondLvlCategoryController = async (req, res) => {
    try {
        await createSecondLvlCategory(req);
        return res.status(200).send({ msg: `${req.body.secondCategory} category created successfully` });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const createThirdLvlCategoryController = async (req, res) => {
    try {
        await createThirdLvlCategory(req);
        return res.status(200).send({ msg: `${req.body.thirdCategory} category created successfully` });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}