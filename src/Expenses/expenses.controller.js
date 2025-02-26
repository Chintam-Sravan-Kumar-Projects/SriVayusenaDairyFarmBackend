
const { expensesModel} = require("./expenses.model");

exports.addexpenseData = async (req, res) => {
    const { dateTime, description,rate } = req.body;
    const expense=description
    try {
        if (!dateTime || !expense || rate === undefined || rate === null || isNaN(rate)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const providedDate = new Date(dateTime);
        if (isNaN(providedDate)) {
            return res.status(400).json({ message: "Invalid dateTime format" });
        }

        const formattedDate = providedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

        const calculatedAmount = rate

        const expensecollection = new expensesModel({
            adminId: req.admin.id,
            ...req.body,
            expense,
            date: formattedDate,  // Using the provided date
            calculatedAmount,
        });

        const savedexpense = await expensecollection.save();

        return res.status(201).json({ message: "expense data submitted", expense: savedexpense });

        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};




// get Single expense data using customer id

exports.getSingleexpenseData = async (req, res) => {
    try {
      const expenseData = await expensesModel
        .find({ adminId: req.admin.id })
        .select("expense calculatedAmount date") // Ensure 'expense' is included
        .populate("adminId", "name email mobile shopName")
        .exec();
  
      if (!expenseData.length) {
        return res.status(404).send({ msg: "No expenses found for this admin." });
      }

      res.status(200).send({
        total_entries: expenseData.length,
        data: expenseData,
      });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  


// get all expense collection data without pagination
exports.getexpenseCollections = async (req, res) => {
	try {
		const expensecollections= await expensesModel.find({ adminId: req.admin.id });
			res.status(200).json({ count: expensecollections.length, expensecollections });
		
	} catch (error) {
		res.status(500).json({ message:"Server error",error: error.message });
	}
};



// get all expense collection entries with pagination
exports.getexpenseCollectionWithPagination = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 3
    const sort=req.query.sort || "asc";
  

		// Calculate the skip value based on the page and pageSize
		const skip = (page - 1) * pageSize;

		// Query the database with pagination
		const expensecollections = await expensesModel.find({ adminId: req.admin.id })
			.skip(skip)
			.limit(pageSize)
			.sort({ date: sort }); // Optionally, you can sort the entries by date

		// Count total number of entries for pagination
		const totalEntries = await expensesModel.countDocuments({
			adminId: req.admin.id,
		});

		// Calculate total pages
		const totalPages = Math.ceil(totalEntries / pageSize);

		// Create the response object with entries, total pages, and current page
		const response = {
			expensecollections,
			totalPages,
			currentPage: page,
		};

		return res.status(200).json(response);
	} catch (error) {
		//console.error(error);
		return res.status(500).json({ message: "Internal Server Error",error:error.message });
	}
};


//update customer expense data
exports.updateexpenseCollection = async (req, res) => {
    try {
      const { calculatedAmount } = req.body;
      const rate=calculatedAmount
  
      if (!rate) {
        return res.status(400).json({ message: "Rate is required" });
      }
  
      const updatedData = { ...req.body, calculatedAmount: rate };
  
      const expenseCollection = await expensesModel.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true } // Ensures the updated document is returned
      );
  
      if (!expenseCollection) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      res.status(200).json({ message: "Data updated successfully", data: expenseCollection });
      
    } catch (error) {
      console.error("Update Error:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  

// delete expense collection by id
exports.deleteexpenseCollection = async (req, res) => {
    try {
  
      const deletedExpenseData = await expensesModel.findByIdAndDelete(req.params.id);
  
      if (!deletedExpenseData) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      res.status(200).json({ message: "Expense collection deleted successfully", data: deletedExpenseData });
    } catch (error) {
      console.error("Delete Error:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  


