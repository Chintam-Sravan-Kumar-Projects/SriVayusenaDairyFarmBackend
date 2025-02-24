const mongoose = require("mongoose");

const producedmilkSchema = new mongoose.Schema(
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
    shift:{    
        type:String,   // auto update based on time
        require:[true, "Please Specify shift"],
        enum:["morning","evening"]
    },
    category: {
      type: String,
      enum: ["cow", "buffalo", "goat"],
      default: "buffalo",
    },
    litter: {
      type: Number,
      required: [true, "Quantity Required"],
      default: 0.0,
    },
    fatRate:{
      type:Number,
      //required:true
    },
    
    rate: {
      type: Number,
      //required: true
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

const producedmilkModel = mongoose.model("ProducedMilk", producedmilkSchema);

module.exports = {
  producedmilkModel,
};

