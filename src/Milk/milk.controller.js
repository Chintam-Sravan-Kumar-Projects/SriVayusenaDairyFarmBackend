
const { MilkModel} = require("./milk.model");
const { customerModel } = require("../Customer/customer.model");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const { sendMail } = require("../middleware/sendMail");
const { rateSettingModel } = require("./RateSetting/rateSetting.model");


exports.addMilkData = async (req, res) => {
    const { dateTime, category, litter } = req.body;
    const { id } = req.params;
    try {
        if (!dateTime || !category || litter === undefined || litter === null || isNaN(litter)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const customer = await customerModel.findOne({ _id: id, adminId: req.admin.id });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found!" });
        }

        const { name, email, mobile } = customer;

        // Parse dateTime and determine shift
        const providedDate = new Date(dateTime);
        if (isNaN(providedDate)) {
            return res.status(400).json({ message: "Invalid dateTime format" });
        }

        const shift = providedDate.getHours() < 12 ? "morning" : "evening";

        const formattedDate = providedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

        const rateSetting = await rateSettingModel.findOne({ adminId: req.admin.id, milkCategory: category });
        if (!rateSetting) {
            return res.status(400).json({ message: `Rate settings for ${category} not found` });
        }

        const parsedLitter = parseFloat(litter);
        if (isNaN(parsedLitter)) {
            return res.status(400).json({ message: "Invalid litter value" });
        }

        const calculatedAmount = rateSetting.ratePerFat * parsedLitter;
        const rate = rateSetting.ratePerFat;

        const customerMilkCollection = new MilkModel({
            adminId: req.admin.id,
            customerId: id,
            ...req.body,
            shift,
            date: formattedDate,  // Using the provided date
            rate,
            calculatedAmount,
            mobile,
        });

        const savedMilkData = await customerMilkCollection.save();
        req.milkdata = { ...savedMilkData._doc, name, email, litter };
        sendMail(req, res, () => {
            return res.status(200).json({ message: "Milk data submitted", milk: savedMilkData });
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};




// get Single customer milk data using customer id

exports.getSinglecustomerMilkData = async (req, res) => {
	const { id } = req.params;

	try {
		UserMilkData = await MilkModel.find({ customerId:id, adminId: req.admin.id })
		.populate('customerId', 'name email mobile') // Populating customer information
        .populate('adminId', 'name email mobile shopName') // Populating admin information
        .exec();
		
		const Admin=
		res.status(200).send({
			total_entries: UserMilkData.length,
			data: UserMilkData,
		});
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
};


// get all milk collection data without pagination
exports.getcustomerMilkCollections = async (req, res) => {
	try {
		const milkcollections= await MilkModel.find({ adminId: req.admin.id });
		
			res.status(200).json({ count: milkcollections.length, milkcollections });
		
	} catch (error) {
		res.status(500).json({ message:"Server error",error: error.message });
	}
};



// get all milk collection entries with pagination
exports.getcustomerMilkCollectionWithPagination = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 3
    const sort=req.query.sort || "asc";
  

		// Calculate the skip value based on the page and pageSize
		const skip = (page - 1) * pageSize;

		// Query the database with pagination
		const milkcollections = await MilkModel.find({ adminId: req.admin.id })
			.skip(skip)
			.limit(pageSize)
			.sort({ date: sort }); // Optionally, you can sort the entries by date

		// Count total number of entries for pagination
		const totalEntries = await MilkModel.countDocuments({
			adminId: req.admin.id,
		});

		// Calculate total pages
		const totalPages = Math.ceil(totalEntries / pageSize);

		// Create the response object with entries, total pages, and current page
		const response = {
			milkcollections,
			totalPages,
			currentPage: page,
		};

		return res.status(200).json(response);
	} catch (error) {
		//console.error(error);
		return res.status(500).json({ message: "Internal Server Error",error:error.message });
	}
};


//update customer milk data
exports.updateMilkCollection = async (req, res) => {
  try {
	const {category,litter}=req.body;
	
	// Fetch rate settings for the given milk category
	const rateSetting = await rateSettingModel.findOne({ adminId: req.admin.id, milkCategory:category });
	if (!rateSetting) {
		return res.status(400).json({ msg: `Rate settings for ${category} not found` });
	}

	
	const calculatedAmount = rateSetting.ratePerFat * parseFloat(litter).toFixed(3); // Calculate final totalAmount

	const newMilkCollection =req.body;
	const newUpdatedMilkCollection={...newMilkCollection,calculatedAmount};

      const milkCollection = await MilkModel.findByIdAndUpdate(req.params.id, newUpdatedMilkCollection, { new: true });

      res.status(200).json({message:"data updated",data:milkCollection});
	  
  } catch (error) {
     
      res.status(500).json({message:'Server Error',error:error.message});
  }
};

// delete milk collection by id
exports.deleteMilkCollection = async (req, res) => {
  try {
     const deletedmilkData= await MilkModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Milk Collection deleted',data:deletedmilkData});
  } catch (error) {
      //console.error(err.message);
      res.status(500).json({message:'Server Error',error:error.message});
  }
};


