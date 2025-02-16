const express=require("express");


const {sendMail}=require("../middleware/sendMail");
const authMiddleware = require("../middleware/authMiddleware");
const { getSinglecustomerMilkData, getcustomerMilkCollections, getcustomerMilkCollectionWithPagination, updateMilkCollection, addMilkData, deleteMilkCollection } = require("./milk.controller");
const MilkRouter=express.Router();


MilkRouter.post("/:id",authMiddleware,addMilkData,sendMail);
MilkRouter.get("/:id",authMiddleware,getSinglecustomerMilkData);
MilkRouter.get("/",authMiddleware,getcustomerMilkCollections)
MilkRouter.get("/get",authMiddleware,getcustomerMilkCollectionWithPagination);
MilkRouter.patch("/:id",authMiddleware,updateMilkCollection)
MilkRouter.delete("/:id",authMiddleware,deleteMilkCollection);



module.exports={
  MilkRouter
}