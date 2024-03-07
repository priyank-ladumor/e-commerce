import { createMultipleProduct, createProduct, deleteProduct, findProductById, getAllProduct, getKidsProducts, getMenProducts, getWomenProducts, updateProduct } from "../services/product.service.js"

export const createProductController = async (req, res) => {
    try {
        const createProd = await createProduct(req.body, req.files)
        return res.status(201).send(createProd);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const deleteProductController = async (req, res) => {
    const productId = req.params.id;
    try {
        const Product = await deleteProduct(productId)
        return res.status(200).send(Product);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const updateProductController = async (req, res) => {
    const productId = req.params.id;
    try {
        const Product = await updateProduct(productId, req.body)
        return res.status(200).send(Product);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const findProductByIdController = async (req, res) => {
    const productId = req.params.id;
    try {
        const Product = await findProductById(productId)
        return res.status(200).send(Product);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const getAllProductController = async (req, res) => {
    try {
        const Product = await getAllProduct(req.query);
        return res.status(200).send(Product);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const createMultipleProdController = async (req, res) => {
    try {
        const Product = await createMultipleProduct(req.query);
        return res.status(201).send({ msg: "multi products created succssfully" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

export const getMenProductsController = async (req, res) => {
    try {
        const Product = await getMenProducts();
        return res.status(200).send(Product);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}
export const getWomenProductsController = async (req, res) => {
    try {
        const Product = await getWomenProducts();
        return res.status(200).send(Product);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}
export const getKidsProductsController = async (req, res) => {
    try {
        const Product = await getKidsProducts();
        return res.status(200).send(Product);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}