
import express from "express"
import { getTopLevelCategoryController, getThirdLevelCategoryController, getSecondLevelCategoryController } from "../controllers/categories.controllers.js";
const categoriesRouter = express.Router()

categoriesRouter
    .get("/toplevel", getTopLevelCategoryController)
    .get("/secondlevel", getSecondLevelCategoryController)
    .get("/thirdlevel", getThirdLevelCategoryController)

export { categoriesRouter };