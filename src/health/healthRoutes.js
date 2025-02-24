const express=require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { getSinglecowhealthData, getcowhealthCollections, getcowhealthCollectionWithPagination, addhealthData, deletehealthCollection } = require("./health.controller");
const healthRouter=express.Router();


healthRouter.post("/:id",authMiddleware,addhealthData);
healthRouter.get("/:id",authMiddleware,getSinglecowhealthData);
healthRouter.get("/",authMiddleware,getcowhealthCollections)
healthRouter.get("/get",authMiddleware,getcowhealthCollectionWithPagination);
healthRouter.delete("/:id",authMiddleware,deletehealthCollection);



module.exports={
  healthRouter
}