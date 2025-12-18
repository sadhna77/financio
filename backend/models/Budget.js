const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserFinancio",
      required: true,
    },

    budgetamount: {
      type: Number,
      required: true,
    },

    budgetType: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
     isActive: { 
    type: Boolean, 
    default: false 
  }
  },
  { timestamps: true }
);

// prevent exact same type + startDate for same user
BudgetSchema.index({ userId: 1, budgetType: 1, startDate: 1 }, { unique: true });

module.exports = mongoose.model("BudgetPlan", BudgetSchema);
