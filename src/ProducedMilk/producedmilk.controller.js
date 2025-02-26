
const { producedmilkModel} = require("./producedmilk.model");
const { cowModel } = require("../cow/cow.model");

exports.addMilkData = async (req, res) => {
    const { category, litter, dateTime } = req.body; // Taking dateTime from frontend
    const { id } = req.params;

    try {
        if (!category || litter === undefined || litter === null || isNaN(litter) || !dateTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const cow = await cowModel.findOne({ _id: id, adminId: req.admin.id });
        if (!cow) {
            return res.status(404).json({ message: "Cow not found!" });
        }

        const { name } = cow;
        
        const shift = new Date(dateTime).getHours() < 12 ? "morning" : "evening"; // Shift based on provided date
        const date = new Date(dateTime).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

        const parsedLitter = parseFloat(litter);
        if (isNaN(parsedLitter)) {
            return res.status(400).json({ message: "Invalid litter value" });
        }

        const cowMilkCollection = new producedmilkModel({
            adminId: req.admin.id,
            cowId: id,
            ...req.body,
            shift,
            date,  // Using date from frontend
        });

        const savedMilkData = await cowMilkCollection.save();

        return res.status(200).json({ message: "Milk data submitted", milk: savedMilkData });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getSinglecowMilkData = async (req, res) => {
	const { id } = req.params;

	try {
		cowMilkData = await producedmilkModel.find({ cowId:id, adminId: req.admin.id })
		.populate('cowId', 'name') // Populating customer information
        .populate('adminId', 'name') // Populating admin information
        .exec();
		
		res.status(200).send({
			total_entries: cowMilkData.length,
			data: cowMilkData,
		});
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
};


// get all milk collection data without pagination
exports.getcowMilkCollections = async (req, res) => {
	try {
		const milkcollections= await producedmilkModel.find({ adminId: req.admin.id });
		
			res.status(200).json({ count: milkcollections.length, milkcollections });
		
	} catch (error) {
		res.status(500).json({ message:"Server error",error: error.message });
	}
};



// get all milk collection entries with pagination
exports.getcowMilkCollectionWithPagination = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 3
    const sort=req.query.sort || "asc";
  

		// Calculate the skip value based on the page and pageSize
		const skip = (page - 1) * pageSize;

		// Query the database with pagination
		const milkcollections = await producedmilkModel.find({ adminId: req.admin.id })
			.skip(skip)
			.limit(pageSize)
			.sort({ date: sort }); // Optionally, you can sort the entries by date

		// Count total number of entries for pagination
		const totalEntries = await producedmilkModel.countDocuments({
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

exports.updateproducedmilkCollection = async (req, res) => {
    try {
      const {category,litter}=req.body;
      
      // Fetch rate settings for the given milk category

      const newMilkCollection =req.body;
      const newUpdatedMilkCollection={...newMilkCollection};
  
        const milkCollection = await producedmilkModel.findByIdAndUpdate(req.params.id, newUpdatedMilkCollection, { new: true });
  
        res.status(200).json({message:"data updated",data:milkCollection});
        
    } catch (error) {
       
        res.status(500).json({message:'Server Error',error:error.message});
    }
  };
  
// delete milk collection by id
exports.deleteMilkCollection = async (req, res) => {
  try {
     const deletedmilkData= await producedmilkModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Milk Collection deleted',data:deletedmilkData});
  } catch (error) {
      //console.error(err.message);
      res.status(500).json({message:'Server Error',error:error.message});
  }
};


