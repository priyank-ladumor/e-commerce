import dotenv from "dotenv"
import { ConnectDB } from "./db/db.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser"
import morgan from "morgan"
import { userRouter } from "./routes/user.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { cartItemRouter } from "./routes/cartItem.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { adminProductRouter } from "./routes/adminProduct.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import { ratingRouter } from "./routes/rating.routes.js";
import { categoriesRouter } from "./routes/categories.routes.js";
import { sizeRouter } from "./routes/size.routes.js";
import { addressRouter } from "./routes/address.routes.js";
import { bannerRouter } from "./routes/banner.routes.js";
import { logoRouter } from "./routes/logo.routes.js";

dotenv.config({
    path: "./.env"
})

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
app.use('/cart', cartRouter)
app.use('/cartitem', cartItemRouter)
app.use('/order', orderRouter)
app.use('/admin/products', adminProductRouter)
app.use('/products', productRouter)
app.use('/review', reviewRouter)
app.use('/rating', ratingRouter)
app.use('/categories', categoriesRouter)
app.use('/size', sizeRouter)
app.use('/address', addressRouter)
app.use('/banner', bannerRouter)
app.use('/logo', logoRouter)

ConnectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        })
    })


