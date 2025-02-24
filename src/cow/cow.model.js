const mongoose = require("mongoose");

// milk provider model
const cowSchema = new mongoose.Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
		
		name: {
			type: String,
			required: [true, "Please add first and last name"],
		},
		category: {
			type: String,
			enum: ["Cow", "Buffalo"],
			default: "cow",
		  },
		village: {
			type: String,
			required: [true, "Please add village name"],
		},
		
		milks: [],

	},
	{
		timestamps: true,
	}
);

const cowModel = mongoose.model("cow", cowSchema);

module.exports = {
	cowModel,
};
