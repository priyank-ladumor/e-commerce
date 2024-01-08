import express from "express"
import { createUser } from "../controllers/user.controllers.js"
const userRouter = express.Router()

userRouter
.get("/", createUser)

export  {userRouter};