const express=require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getSingleexpenseData, getexpenseCollections, getexpenseCollectionWithPagination, updateexpenseCollection, addexpenseData, deleteexpenseCollection } = require("./expenses.controller");
const expenseRouter=express.Router();


expenseRouter.post("/:id",authMiddleware,addexpenseData);
expenseRouter.get("/:id",authMiddleware,getSingleexpenseData);
expenseRouter.get("/",authMiddleware,getexpenseCollections)
expenseRouter.get("/get",authMiddleware,getexpenseCollectionWithPagination);
expenseRouter.patch("/:id",authMiddleware,updateexpenseCollection);
expenseRouter.delete("/:id",authMiddleware,deleteexpenseCollection);



module.exports={
  expenseRouter
}