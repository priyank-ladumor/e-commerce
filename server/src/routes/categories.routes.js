
import express from "express"
import { getTopLevelCategoryController, getThirdLevelCategoryController, getSecondLevelCategoryController, delteCategoryByIdController, EditCategoryByIdController, createTopLvlCategoryController, createSecondLvlCategoryController, createThirdLvlCategoryController, getSearchCategoryController, getThirdLevelCategoryUseInFilterController } from "../controllers/categories.controllers.js";
const categoriesRouter = express.Router()

categoriesRouter
    .get("/toplevel", getTopLevelCategoryController)
    .get("/secondlevel", getSecondLevelCategoryController)
    .post("/thirdlevel", getThirdLevelCategoryController)
    .post("/thirdlevel/filterd", getThirdLevelCategoryUseInFilterController)
    .post("/search", getSearchCategoryController)
    .delete("/:id", delteCategoryByIdController)
    .patch("/:id", EditCategoryByIdController)
    .post("/toplevel/create", createTopLvlCategoryController)
    .post("/secondlevel/create", createSecondLvlCategoryController)
    .post("/thirdlevel/create", createThirdLvlCategoryController)

export { categoriesRouter };