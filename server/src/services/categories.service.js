import { Categories } from "../models/category.model.js"


export const getTopLevelCategory = async () => {
    const level1 = await Categories.find({level: 1})
    if (level1) {
        return level1;
    } else {
        throw new Error("no available top level category")
    }
}

export const getSecondLevelCategory = async () => {
    const level2 = await Categories.find({level: 2})
    if (level2) {
        return level2;
    } else {
        throw new Error("no available second level category")
    }
}

export const getThirdLevelCategory = async () => {
    const level3 = await Categories.find({level: 3})
    if (level3) {
        return level3;
    } else {
        throw new Error("no available third level category")
    }
}