import { Categories } from "../models/category.model.js"


export const getTopLevelCategory = async (reqData) => {
    const level1 = Categories.find({ level: 1 })
    if (level1) {
        const { pageNumber, pageSize } = reqData.query;
        const totalLv1 = await Categories.countDocuments(level1);
        const AllLv1 = await level1.skip((pageNumber - 1) * pageSize).limit(pageSize);
        const totalPages = Math.ceil(totalLv1 / pageSize);

        return { content: AllLv1, currentPage: pageNumber, totalPages: totalPages }
    } else {
        throw new Error("no available top level category")
    }
}

export const getSecondLevelCategory = async (reqData) => {
    const level2 = Categories.find({ level: 2 })
    if (level2) {
        const { pageNumber, pageSize } = reqData.query;
        const totalLv2 = await Categories.countDocuments(level2);
        const AllLv2 = await level2.skip((pageNumber - 1) * pageSize).limit(pageSize);
        const totalPages = Math.ceil(totalLv2 / pageSize);

        return { content: AllLv2, currentPage: pageNumber, totalPages: totalPages }

    } else {
        throw new Error("no available second level category")
    }
}

export const getThirdLevelCategory = async (reqData) => {
    const level3 = Categories.find({ level: 3 })
    if (level3) {
        const { pageNumber, pageSize } = reqData.query;
        const totalLv3 = await Categories.countDocuments(level3);
        const AllLv3 = await level3.skip((pageNumber - 1) * pageSize).limit(pageSize);
        const totalPages = Math.ceil(totalLv3 / pageSize);

        return { content: AllLv3, currentPage: pageNumber, totalPages: totalPages }
    } else {
        throw new Error("no available third level category")
    }
}