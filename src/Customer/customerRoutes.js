const express=require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { createcustomer, getAllcustomer, getSinglecustomer, updatecustomer, deletecustomer } = require("./customer.controller");

const customerRouter=express.Router();

customerRouter.post("/register",authMiddleware,createcustomer)
customerRouter.get("/",authMiddleware,getAllcustomer);
customerRouter.get('/:id',authMiddleware,getSinglecustomer);
customerRouter.patch("/:id",authMiddleware,updatecustomer)
customerRouter.delete("/:id",authMiddleware,deletecustomer);


module.exports={
  customerRouter
}