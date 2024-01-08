import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser"
import morgan from "morgan"
import {userRouter} from "./routes/user.routes.js";
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true }))
app.use(express.static(".././public"))
app.use(morgan('default'))
app.use(cookieParser())

app.use('/user', userRouter)

export { app }