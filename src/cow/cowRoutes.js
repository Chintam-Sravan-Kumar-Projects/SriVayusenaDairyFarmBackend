const express=require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { createcow, getAllcows, getSinglecow, updatecow, deletecow } = require("./cow.controller");

const cowRouter=express.Router();

cowRouter.post("/register",authMiddleware,createcow)
cowRouter.get("/",authMiddleware,getAllcows);
cowRouter.get('/:id',authMiddleware,getSinglecow);
cowRouter.patch("/:id",authMiddleware,updatecow)
cowRouter.delete("/:id",authMiddleware,deletecow);


module.exports={
  cowRouter
}