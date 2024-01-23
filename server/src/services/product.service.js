// import { set } from "mongoose";
import { Categories } from "../models/category.model.js"
import { Product } from "../models/product.models.js";


export const createProduct = async (reqData) => {
    let topLevel = await Categories.find({ name: reqData.topLevelCategory });

    if (!topLevel || !(topLevel.length > 0)) {
        const topLevel = await new Categories({
            name: reqData.topLevelCategory,
            level: 1
        })
        await topLevel.save();
    }

    let secondLevel = await Categories.findOne({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel[0]._id
    })

    if (!secondLevel) {
        const secondLevel = new Categories({
            name: reqData.secondLevelCategory,
            parentCategory: topLevel[0]._id,
            level: 2
        })
        await secondLevel.save();
    }

    let thirdLevel = await Categories.findOne({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
    })
    console.log(secondLevel, "secondLevel");
    console.log(thirdLevel, "thirdLevel bahar");

    if (!thirdLevel?.length > 0) {
        const thirdLevel = new Categories({
            name: reqData.thirdLevelCategory,
            parentCategory: secondLevel._id,
            level: 3
        })
        await thirdLevel.save();
        console.log(thirdLevel, "thirdLevel");
    }

    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountPrice: reqData.discountPrice,
        discountPercentage: reqData.discountPercentage,
        thumbnail: reqData.thumbnail,
        images: reqData.images,
        brand: reqData.brand,
        price: reqData.price,
        sizes: reqData.sizes,
        quantity: reqData.quantity,
        category: thirdLevel._id,
    })

    return await product.save();
}

export const deleteProduct = async (productId) => {
    const product = await findProductById(productId);
    await Product.findByIdAndDelete(productId)
    return "product deleted successfully"
}

export const updateProduct = async (productId, reqData) => {
    return await Product.findByIdAndUpdate(productId, reqData)
}

export const findProductById = async (id) => {
    const product = await Product.findById(id).populate("Category").exec();
    if (!product) {
        throw new Error("Product not found with id: ", id)
    }
    return product;
}

export const getAllProduct = async (reqQuery) => {
    let { category, color, sizes, minPrice, maxPrice, stock, minDiscount, sort, pageNumber, pageSize } = reqQuery;

    pageSize = pageSize || 12;

    let query = Product.find().populate("Categories");

    if (category) {
        const exitCategory = await Categories.findOne({ name: category });

        if (exitCategory) {
            query = query.where('Categories', exitCategory._id)
        } else {
            return { content: [], currentPage: 1, totalPage: 0 }
        }
    }

    if (color) {
        const colorSet = new set(color.split(",").map(color => color.trim().toLowerCase()));

        const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;

        query = query.where("color").regex(colorRegex);
    }

    if (sizes) {
        const sizesSet = new set(sizes);
        query = query.where("sizes.name").in([...sizesSet]);
    }

    if (minPrice && maxPrice) {
        query = query.where("discountPrice").gte(minPrice).lte(maxPrice);
    }

    if (minDiscount) {
        query = query.where("discountPercentage").gt(minDiscount);
    }
    if (stock) {
        if (stock == "in_stock") {
            // query = query.where("quantity", ">=" , 0);
            query = query.where("quantity").gt(0);
        }
        else if (stock == "out_of_stock") {
            query = query.where("quantity").gt(1);
        }
    }

    if (sort) {
        const sortDirection = sort === "price_hight" ? -1 : 1;
        query = query.sort({ discountPrice: sortDirection })
    }

    const totalProduct = await Product.countDocuments(query);
    const products = await query.skip((pageNumber - 1) * pageSize).limit(pageSize).exec();

    const totalPages = Math.ceil(totalProduct / pageSize);

    return { content: products, currentPage: pageNumber, totalPages }
}

export const createMultipleProduct = async (products) => {
    for (let product of products) {
        await createProduct(product);
    }
}