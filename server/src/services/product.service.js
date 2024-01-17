import { set } from "mongoose";
import { Category } from "../models/category.model"
import { Product } from "../models/product.models";


export const createProduct = async (reqData) => {
    let topLevel = await Category.find({ name: reqData.topLevelCategory });

    if (!topLevel) {
        topLevel = new Category({
            name: reqData.topLevelCategory,
            level: 1
        })
    }

    let secondLevel = await Category.findOne({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id
    })

    if (!secondLevel) {
        secondLevel = new Category({
            name: reqData.secondLevelCategory,
            parentCategory: topLevel._id,
            level: 2
        })
    }

    let thirdLevel = await Category.findOne({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
    })

    if (!thirdLevel) {
        thirdLevel = new Category({
            name: reqData.thirdLevelCategory,
            parentCategory: secondLevel, _id,
            level: 3
        })
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

    let query = Product.find().populate("Category");

    if (category) {
        const exitCategory = await Category.findOne({ name: category });

        if (exitCategory) {
            query = query.where('Category', exitCategory._id)
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

    const totalPages = Math.ceil(totalProduct/pageSize);

    return {content: products, currentPage: pageNumber, totalPages}
}

export const createMultipleProduct = async (products) => {
    for(let product of products){
        await createProduct(product);
    }
}