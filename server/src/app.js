import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser"
import morgan from "morgan"
import { userRouter } from "./routes/user.routes.js";
import { adminOrderRouter } from "./routes/adminOrder.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { cartItemRouter } from "./routes/cartItem.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { adminProductRouter } from "./routes/adminProduct.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import { ratingRouter } from "./routes/rating.routes.js";
import { categoriesRouter } from "./routes/categories.routes.js";

const app = express()

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "15mb" }))
app.use(express.urlencoded({ limit: "15mb", extended: true }))
app.use(express.static(".././public"))
app.use(morgan('default'))
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/admin/order', adminOrderRouter)
app.use('/cart', cartRouter)
app.use('/cartitem', cartItemRouter)
app.use('/order', orderRouter)
app.use('/admin/products', adminProductRouter)
app.use('/products', productRouter)
app.use('/review', reviewRouter)
app.use('/rating', ratingRouter)
app.use('/categories', categoriesRouter)

//cloudinary upload
import { uploadOnCloudinary } from "./multer/cloudinary.js";
import { Multer } from "./models/multer.js";
import { upload } from "./multer/multer.js";

const uploadImgs = async (req, res) => {
    const cloud = await uploadOnCloudinary(req.body.imgs);
    //for formData
    // const cloud = await uploadOnCloudinary(req.files);
    const img = new Multer();
    img.imgs = cloud
    await img.save()
    res.send(img)
}
app.post("/multer", upload.array('imgs'), uploadImgs)
//cloudinary upload

export { app }