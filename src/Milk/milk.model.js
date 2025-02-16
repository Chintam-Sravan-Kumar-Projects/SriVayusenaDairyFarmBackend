const mongoose = require("mongoose");

const milkSchema = new mongoose.Schema(
  {
    adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
    customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "customer",
			required: true,
		},
    mobile: {
      type: Number,
      default:0,
      
    },
    shift:{    
        type:String,   // auto update based on time
        require:[true, "Please Specify shift"],
        enum:["morning","evening"]
    },
    category: {
      type: String,
      enum: ["cow", "buffalo", "goat"],
      default: "cow",
    },
    snf: {
      type: Number,
      //required: [true, "SNF Required"],
    },
    fat: {
      type: Number,
      //required: [true, "FAT Required"],
    },
    water: {
      type: Number,
      default: 0.0,
    },
    degree:{
      type:Number,
      default:0.0,
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
      required: true
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

const MilkModel = mongoose.model("Milk", milkSchema);

module.exports = {
  MilkModel,
};

