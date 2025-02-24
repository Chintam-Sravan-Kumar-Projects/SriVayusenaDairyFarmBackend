const express=require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getSinglecowMilkData, getcowMilkCollections, getcowMilkCollectionWithPagination, addMilkData, deleteMilkCollection,updateproducedmilkCollection} = require("./producedmilk.controller");
const producedmilkRouter=express.Router();


producedmilkRouter.post("/:id",authMiddleware,addMilkData);
producedmilkRouter.get("/:id",authMiddleware,getSinglecowMilkData);
producedmilkRouter.get("/",authMiddleware,getcowMilkCollections)
producedmilkRouter.get("/get",authMiddleware,getcowMilkCollectionWithPagination);
producedmilkRouter.delete("/:id",authMiddleware,deleteMilkCollection);
producedmilkRouter.patch("/:id",authMiddleware,updateproducedmilkCollection)


module.exports={
  producedmilkRouter
}