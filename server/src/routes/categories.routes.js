
import express from "express"
import { getTopLevelCategoryController, getThirdLevelCategoryController, getSecondLevelCategoryController, delteCategoryByIdController, EditCategoryByIdController, createTopLvlCategoryController, createSecondLvlCategoryController, createThirdLvlCategoryController } from "../controllers/categories.controllers.js";
const categoriesRouter = express.Router()

categoriesRouter
    .get("/toplevel", getTopLevelCategoryController)
    .get("/secondlevel", getSecondLevelCategoryController)
    .get("/thirdlevel", getThirdLevelCategoryController)
    .delete("/:id", delteCategoryByIdController)
    .patch("/:id", EditCategoryByIdController)
    .post("/toplevel/create", createTopLvlCategoryController)
    .post("/secondlevel/create", createSecondLvlCategoryController)
    .post("/thirdlevel/create", createThirdLvlCategoryController)

export { categoriesRouter };