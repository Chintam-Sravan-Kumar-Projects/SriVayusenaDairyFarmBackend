const express = require("express");

const { customerModel } = require("./customer.model");

// POST request to create a new milk provider

exports.createcustomer = async (req, res) => {
	try {
		const {  mobile } = req.body;
		
		// Check if the user already exists
		const iscustomer = await customerModel.findOne({
			mobile,
			adminId: req.admin.id,
		});

		if (iscustomer) {
			// User already exists, send a 409 Conflict response
			return res.status(200).json({ message: "customer already exists with same mobile number. " });
		}

		
    // Create a new milk provider customer
    const customer= new customerModel({...req.body,adminId: req.admin.id});
    const newcustomer=await customer.save();

		     res
			.status(200)
			.send({ msg: "New customer added successfully", newcustomer });
	} catch (error) {
		// Handle other errors and send a 500 Internal Server Error response

		res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
};

//get all users without pagination

exports.getAllcustomer=async(req,res)=>{
  console.log("admin id",req.admin)
  try {
    const customers= await customerModel.find({adminId:req.admin.id});
   
      res.status(200).json({"count":customers.length,customers})
    
  } catch (error) {
    res.status(500).json({"message":"Something wen't wrong",error:error.message})
  }
}

//get all user / pagination


exports.getAllcustomerWithPagination = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const _sort = req.query._sort || "desc";

		// Calculate the skip value based on the page and pageSize
		const skip = (page - 1) * pageSize;
		
		// Query the database with pagination
		const usersEntries = await customerModel
			.find({})
			.skip(skip)
			.limit(pageSize)
			.sort({ date: _sort }); // Optionally, you can sort the entries by date

		// Count total number of entries for pagination
		const totalEntries = await customerModel.countDocuments({});

		// Calculate total pages
		const totalPages = Math.ceil(totalEntries / pageSize);

		// Create the response object with entries, total pages, and current page
		const response = {
			totalPages,
			currentPage: page,
			totalCount: usersEntries.length,
			users: usersEntries,
		};

		return res.status(200).json(response);
	} catch (error) {
		
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

// find user by thire userId and mobile number
exports.getSinglecustomer = async (req, res) => {
	try {
		const { id } = req.params;

		// Find a user by name or mobile number
		const customer = await customerModel.find({
			adminId: req.admin.id,
		    _id: id 
		});

		res.status(200).json({message:"success",customer});

	} catch (error) {
		res.status(500).json({"message":"server error", error: error.message });
	}
};

exports.updatecustomer = async (req, res) => {
    try {
        const customer = await customerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({message:"success",customer});
    } catch (error) {
        console.error(err.message);
        res.status(500).send({"message":'Server Error',error:error.message});
    }
};

// delete user by mobile number
exports.deletecustomer = async (req, res) => {
    try {
        const deletecustomer=await customerModel.deleteOne({
				_id: req.params.id,
				adminId: req.admin.id,
			});

        res.status(200).json({ message: 'customer deleted',customer:deletecustomer,id:req.params.id});
    } catch (error) {
        
        res.status(500).send({"message":'Server Error',error:error.message});
    }
};

