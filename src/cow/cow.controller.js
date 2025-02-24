const express = require("express");

const { cowModel } = require("./cow.model");

// POST request to create a new milk provider

exports.createcow = async (req, res) => {
	try {
		const { name } = req.body;
		// Check if the user already exists
		const iscow = await cowModel.findOne({
			name,
			adminId: req.admin.id,
		});

		if (iscow) {
			// User already exists, send a 409 Conflict response
			return res.status(200).json({ message: "cow already exists with same name." });
		}

		
    // Create a new milk provider customer
    const cow= new cowModel({...req.body,adminId: req.admin.id});
    const newcow=await cow.save();
		     res
			.status(200)
			.send({ msg: "New cow added successfully", newcow });
	} catch (error) {
		// Handle other errors and send a 500 Internal Server Error response

		res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
};

//get all users without pagination

exports.getAllcows=async(req,res)=>{

  try {
    const cows= await cowModel.find({adminId:req.admin.id});
   
      res.status(200).json({"count":cows.length,cows})
    
  } catch (error) {
    res.status(500).json({"message":"Something wen't wrong",error:error.message})
  }
}

//get all user / pagination


exports.getAllcowsWithPagination = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const _sort = req.query._sort || "desc";

		// Calculate the skip value based on the page and pageSize
		const skip = (page - 1) * pageSize;
		
		// Query the database with pagination
		const usersEntries = await cowModel
			.find({})
			.skip(skip)
			.limit(pageSize)
			.sort({ date: _sort }); // Optionally, you can sort the entries by date

		// Count total number of entries for pagination
		const totalEntries = await cowModel.countDocuments({});

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
exports.getSinglecow = async (req, res) => {
	try {
		const { id } = req.params;

		// Find a user by name or mobile number
		const cow = await cowModel.find({
			adminId: req.admin.id,
		    _id: id 
		});

		res.status(200).json({message:"success",cow});

	} catch (error) {
		res.status(500).json({"message":"server error", error: error.message });
	}
};

exports.updatecow = async (req, res) => {
    try {
        const cow = await cowModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({message:"success",cow});
    } catch (error) {
        console.error(err.message);
        res.status(500).send({"message":'Server Error',error:error.message});
    }
};

// delete user by mobile number
exports.deletecow = async (req, res) => {
    try {
        const deletecow=await cowModel.deleteOne({
				_id: req.params.id,
				adminId: req.admin.id,
			});

        res.status(200).json({ message: 'cow deleted',cow:deletecow,id:req.params.id});
    } catch (error) {
        
        res.status(500).send({"message":'Server Error',error:error.message});
    }
};

