
const { healthModel} = require("./health.model");
const { cowModel } = require("../cow/cow.model");


exports.addhealthData = async (req, res) => {
    const { duedate, dateTime, title } = req.body;
	
    console.log("datetime",dateTime);
    console.log("duedate",duedate)
    const { id } = req.params;
    try {
      // Check only for required fields (excluding duedate)
      if (!dateTime || !title) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const cow = await cowModel.findOne({ _id: id, adminId: req.admin.id });
      if (!cow) {
        return res.status(404).json({ message: "Cow not found!" });
      }
  
      // Parse dateTime and determine shift
      const providedDate = new Date(dateTime);
      if (isNaN(providedDate)) {
        return res.status(400).json({ message: "Invalid dateTime format" });
      }
  
      // Format dateTime
      const formattedDate = providedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      });
  
      // Format duedate only if provided, otherwise default to empty string
      let formatteddueDate = "";
      if (duedate) {
        const provideddueDate = new Date(duedate);
        if (isNaN(provideddueDate)) {
          return res.status(400).json({ message: "Invalid duedate format" });
        }
        formatteddueDate = provideddueDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: true,
        });
      }
  
      const cowhealthCollection = new healthModel({
        adminId: req.admin.id,
        cowId: id,
        ...req.body,
        duedate: formatteddueDate, // will be empty string if not provided
        date: formattedDate,      // Using the provided dateTime
      });
  
      const savedhealthData = await cowhealthCollection.save();
      return res
        .status(200)
        .json({ message: "Health data submitted", milk: savedhealthData });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  


exports.getSinglecowhealthData = async (req, res) => {
	const { id } = req.params;

	try {
		cowhealthData = await healthModel.find({ cowId:id, adminId: req.admin.id })
		.populate('cowId', 'name') // Populating customer information
        .populate('adminId', 'name email mobile shopName') // Populating admin information
        .exec();

		res.status(200).send({
			total_entries: cowhealthData.length,
			data: cowhealthData,
		});
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
};


// get all milk collection data without pagination
exports.getcowhealthCollections = async (req, res) => {
	try {
		const healthcollections= await healthModel.find({ adminId: req.admin.id });
		
			res.status(200).json({ count: healthcollections.length, healthcollections });
		
	} catch (error) {
		res.status(500).json({ message:"Server error",error: error.message });
	}
};



// get all milk collection entries with pagination
exports.getcowhealthCollectionWithPagination = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 3
    const sort=req.query.sort || "asc";
  

		// Calculate the skip value based on the page and pageSize
		const skip = (page - 1) * pageSize;

		// Query the database with pagination
		const healthcollections = await healthModel.find({ adminId: req.admin.id })
			.skip(skip)
			.limit(pageSize)
			.sort({ date: sort }); // Optionally, you can sort the entries by date

		// Count total number of entries for pagination
		const totalEntries = await healthModel.countDocuments({
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

// delete milk collection by id
exports.deletehealthCollection = async (req, res) => {
  try {
     const deletedhealthData= await healthModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'health Collection deleted',data:deletedhealthData});
  } catch (error) {
      //console.error(err.message);
      res.status(500).json({message:'Server Error',error:error.message});
  }
};


