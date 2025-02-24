const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema(
  {
    adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
    cowId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "cow",
			required: true,
		},
    title: {
      type: String,
    },
    date: {
                    // auto set
      type: String,
      required:[true,"date Required"] // Automatically set to the current date and time
    },
    duedate: {
      // auto set
      type: String,
     
      },
  },
  { timestamps: true }
);

const healthModel = mongoose.model("health", healthSchema);

module.exports = {
  healthModel,
};

