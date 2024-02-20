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
    let level2 = Categories.find({ level: 2 }).populate({ path: "parentCategory", model: Categories });
    if (level2) {
        let { pageNumber, pageSize, parentCategory } = reqData.query;

        if (parentCategory) {
            level2 = level2.where('parentCategory', parentCategory)
        }

        const totalLv2 = await Categories.countDocuments(level2);
        let AllLv2 = await level2.skip((pageNumber - 1) * pageSize).limit(pageSize);
        const totalPages = Math.ceil(totalLv2 / pageSize);

        return { content: AllLv2, currentPage: pageNumber, totalPages: totalPages }

    } else {
        throw new Error("no available second level category")
    }
}

export const getThirdLevelCategory = async (req) => {
    let level3 = Categories.find({ level: 3 }).populate({ path: "parentCategory", model: Categories });
    if (level3) {
        const { pageNumber, pageSize, parentCategory } = req.body;

        if (parentCategory) {
            level3 = level3.where('parentCategory', parentCategory)
        }

        const totalLv3 = await Categories.countDocuments(level3);
        const AllLv3 = await level3.skip((pageNumber - 1) * pageSize).limit(pageSize);
        const totalPages = Math.ceil(totalLv3 / pageSize);

        return { content: AllLv3, currentPage: pageNumber, totalPages: totalPages }
    } else {
        throw new Error("no available third level category")
    }
}

export const getThirdLevelCategoryUseInFilter = async (req) => {
    const { pageNumber, pageSize, parentCategory } = req.body;
    if (parentCategory) {
        let level3 = await Categories.find({ level: 3, parentCategory: parentCategory }).populate({ path: "parentCategory", model: Categories });
        return { content: level3 }
    } else {
        return { content: [] }
    }
}

export const getSearchCategory = async (req) => {
    if (req.body.search) {
        const { pageNumber, pageSize } = req.body;

        // let query = (await Categories.find()).filter(item => item.name.includes(req.body.search))
        let query = Categories.find({ name: { $regex: '.*' + req.body.search + '.*' } })

        const totalQuantity = await Categories.countDocuments(query);
        const finalQuery = await query.skip((pageNumber - 1) * pageSize).limit(pageSize);
        const totalPages = Math.ceil(totalQuantity / pageSize);

        return { content: finalQuery, currentPage: pageNumber, totalPages: totalPages }
    } else {
        throw new Error("did not get search data")
    }
}

export const delteCategoryById = async (CategoryID) => {
    if (CategoryID) {
        const category = Categories.findByIdAndDelete(CategoryID)
        return category
    } else {
        throw new Error("CategoryID not available")
    }
}

export const EditCategoryById = async (req) => {
    if (req.params.id) {
        const category = Categories.findByIdAndUpdate({ _id: req.params.id }, { name: req.body.category }, { new: true })
        return category
    } else {
        throw new Error("CategoryID not available")
    }
}


export const createTopLvlCategory = async (req) => {
    if (req.body.topCategory) {
        const isTopExit = await Categories.findOne({ name: req.body.topCategory });

        if (isTopExit) {
            throw new Error(`${req.body.topCategory} is exits category`)
        } else {
            const category = new Categories({ name: req.body.topCategory, level: 1 });
            category.save();
            return category
        }
    } else {
        throw new Error("did not get top category")
    }
}

export const createSecondLvlCategory = async (req) => {
    if (req.body.topCategory && req.body.secondCategory) {
        const parentCategory = await Categories.findOne({ name: req.body.topCategory });
        const isSecondExit = await Categories.findOne({ name: req.body.secondCategory });
        if (!parentCategory) {
            throw new Error(`${req.body.topCategory} is not a valid Category`)
        } else {
            if (isSecondExit) {
                throw new Error(`${req.body.secondCategory} is exits category`)
            } else {
                const category = new Categories({ name: req.body.secondCategory, level: 2, parentCategory: parentCategory._id });
                category.save();
                return category
            }
        }
    } else {
        throw new Error("did not get top and second category")
    }
}

export const createThirdLvlCategory = async (req) => {
    if (req.body.thirdCategory && req.body.secondCategory) {
        const parentCategory = await Categories.findOne({ name: req.body.secondCategory });
        const isSecondExit = await Categories.findOne({ name: req.body.thirdCategory });
        if (!parentCategory) {
            throw new Error(`${req.body.secondCategory} is not a valid Category`)
        } else {
            if (isSecondExit) {
                throw new Error(`${req.body.thirdCategory} is exits category`)
            } else {
                const category = new Categories({ name: req.body.thirdCategory, level: 3, parentCategory: parentCategory._id });
                category.save();
                return category
            }
        }
    } else {
        throw new Error("did not get second and third category")
    }
}