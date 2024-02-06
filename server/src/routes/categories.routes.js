
import express from "express"
import { getTopLevelCategoryController, getThirdLevelCategoryController, getSecondLevelCategoryController, delteCategoryByIdController, EditCategoryByIdController } from "../controllers/categories.controllers.js";
const categoriesRouter = express.Router()

categoriesRouter
    .get("/toplevel", getTopLevelCategoryController)
    .get("/secondlevel", getSecondLevelCategoryController)
    .get("/thirdlevel", getThirdLevelCategoryController)
    .delete("/:id", delteCategoryByIdController)
    .patch("/:id", EditCategoryByIdController)

export { categoriesRouter };