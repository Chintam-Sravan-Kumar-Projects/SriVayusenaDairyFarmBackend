const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema(
  {
    adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
    expense: {
      type: String,
    },
  calculatedAmount: {
      type: Number,
      //required: true
  },
    date: {
                    // auto set
      type: String,
      required:[true,"date Required"] // Automatically set to the current date and time
    },
    
  },
  { timestamps: true }
);

const expensesModel = mongoose.model("expenses", expensesSchema);

module.exports = {
  expensesModel,
};

