import { Categories } from "../models/category.model.js"
import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../multer/cloudinary.js";


export const createProduct = async (reqData, reqFiles) => {
    if (reqData) {
    // if (reqData && reqFiles) {
        let topLevel = await Categories.find({ name: reqData.topLevelCategory });
        if (!topLevel || !(topLevel.length > 0)) {
            const topLevel = new Categories({
                name: reqData.topLevelCategory,
                level: 1
            })
            await topLevel.save();
        }

        let secondLevel = await Categories.findOne({
            name: reqData.secondLevelCategory,
            parentCategory: topLevel[0]?._id
        })
        if (!secondLevel) {
            const parentCategory = await Categories.findOne({ name: reqData.topLevelCategory })
            if (parentCategory) {
                const secondLevel = new Categories({
                    name: reqData.secondLevelCategory,
                    parentCategory: parentCategory._id,
                    level: 2
                })
                await secondLevel.save();
            }
        }

        let thirdLevel = await Categories.findOne({
            name: reqData.thirdLevelCategory,
            parentCategory: secondLevel?._id,
        })
        if (!thirdLevel) {
            const parentCategory2 = await Categories.findOne({ name: reqData.secondLevelCategory })
            if (parentCategory2) {
                const thirdLevel = new Categories({
                    name: reqData.thirdLevelCategory,
                    parentCategory: parentCategory2._id,
                    level: 3
                })
                await thirdLevel.save();
            }
        }
    } else {
        return new Error("request data not received")
    }

    const quantity = (reqData.sizesAndColor).map((ele) => Number(ele.quantity));
    let totalQuantity = 0;

    for (let i = 0; i < quantity.length; i++) {
        totalQuantity += quantity[i];
    }

    const discountPriceByDiscountedPercentage = Math.round(reqData.price * (1 - reqData.discountPercentage / 100))

    const thumbnail = await uploadOnCloudinary(reqData.thumbnail);
    const productImages = await uploadOnCloudinary(reqData.images);
    // const thumbnail = await uploadOnCloudinary(reqFiles.thumbnail);
    // const productImages = await uploadOnCloudinary(reqFiles.images);

    const parentCategory3 = await Categories.findOne({ name: reqData.thirdLevelCategory })
    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountPrice: discountPriceByDiscountedPercentage,
        discountPercentage: reqData.discountPercentage,
        thumbnail: thumbnail,
        images: productImages,
        brand: reqData.brand,
        price: reqData.price,
        sizesAndColor: reqData.sizesAndColor,
        quantity: totalQuantity,
        category: parentCategory3._id,
        fabric: reqData.fabric,
        material: reqData.material
    })
    return await product.save();
}

export const deleteProduct = async (productId) => {
    // const product = await findProductById(productId);
    await Product.findByIdAndDelete(productId)
    return "product deleted successfully"
}

export const updateProduct = async (productId, reqData) => {
    return await Product.findByIdAndUpdate(productId, reqData)
}

export const findProductById = async (id) => {
    const product = await Product.findById(id).populate({ path: "category", model: Categories }).exec();
    if (!product) {
        throw new Error("Product not found with id: ", id)
    }
    return product;
}

export const getAllProduct = async (reqQuery) => {
    let { category, color, sizes, minPrice, maxPrice, stock, minDiscount, sort, pageNumber, pageSize } = reqQuery;
    pageSize = pageSize || 120;

    let query = Product.find().populate({ path: "category", model: Categories });

    if (category) {
        const exitCategory = await Categories.findOne({ name: category });
        if (exitCategory) {
            query = query.where('category', exitCategory._id)
            // query = query.where("category").equals(exitCategory._id)
        } else {
            return { content: [], currentPage: 1, totalPage: 0 }
        }
    }

    if (color) {
        let clr = color.trim().toLowerCase()
        query = query.where("color").equals(clr)
    }
    if (sizes) {
        query = query.where("sizes.name").equals(sizes);
        // query = query.where("sizes.name").in(sizes); 
        //in only used in array
    }

    if (minPrice) {
        query = query.where("price").gte(Number(minPrice));
    }

    if (maxPrice) {
        query = query.where("price").lte(Number(maxPrice));
    }
    if (minDiscount) {
        query = query.where("discountPercentage").gt(minDiscount);
    }
    if (stock) {
        if (stock == "in_stock") {
            query = query.where("quantity").gte(1);
        }
        else if (stock == "out_of_stock") {
            query = query.where("quantity").lte(0);
        }
    }

    if (sort) {
        const sortDirection = sort === "high_to_low" ? -1 : 1;
        query = query.sort({ price: sortDirection })
    }

    const totalProduct = await Product.countDocuments(query);
    const products = await query.skip((pageNumber - 1) * pageSize).limit(pageSize);
    const totalPages = Math.ceil(totalProduct / pageSize);

    return { content: products, currentPage: pageNumber, totalPages }
}

export const createMultipleProduct = async (products) => {
    for (let product of products) {
        await createProduct(product);
    }
}







// const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
// const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
// query === query.where("color").regex(colorRegex);

// let minp;
// let maxp;
// let clr;
// let ctgy;

// if (minPrice) {
//     minp = {
//         $match:
//         {
//             "price": { $gte: Number(minPrice) }
//         }
//     }
// } else {
//     minp = null;
// }

// if (category) {
//     ctgy = { $match: { "category.name": category } }
// } else {
//     ctgy = null;
// }

// if (maxPrice) {
//     maxp = {
//         $match:
//         {
//             "price": { $lt: Number(maxPrice) }
//         }
//     }
// } else {
//     maxp = null;
// }

// if (color) {
//     clr = { $match: { "color": color } }
// } else {
//     clr = null;
// }



// const pipeline = [
//     clr,
//     // { $group: { _id: "$stars", count: { $sum: 1 } } },
//     minp,
//     maxp,
//     ctgy
// ];

// const pipe = await pipeline.filter((ele) => ele)
// console.log(pipe, "pipe");
// let query = await Product.aggregate(pipe)
// // console.log(query, "query");

// const finalQuery = await Product.aggregate(pipe);

// await Product.populate(finalQuery, { path: "category", model: Categories });
// console.log(finalQuery, "finalQuery");