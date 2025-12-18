const Income = require("../models/Income");
const Expense = require("../models/Expense");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors()); // Allows cross-origin requests from frontend
const UserFinancio = require("../models/User"); // Imports the User model for database operations
const BudgetPlan = require("../models/Budget"); // Imports the Budget model for database operations


const compareBudgetPlans = async (req, res) => {
  try {
    const { userId } = req.query;

    // 1️⃣ All budgets of user (oldest first)
    const budgets = await Budget.find({ userId }).sort({ createdAt: 1 });

    // 2️⃣ Final compare result
    const result = [];

    for (const plan of budgets) {
      // Total spent in this budget period
      const expenses = await Expense.find({
        userId,
        date: { $gte: plan.startDate, $lte: plan.endDate },
      });

      const totalSpent = expenses.reduce(
        (sum, e) => sum + (e.amount || 0),
        0
      );

      result.push({
        budgetId: plan._id,
        budgetType: plan.budgetType,
        startDate: plan.startDate,
        endDate: plan.endDate,
        budgetAmount: plan.budgetamount,
        spent: totalSpent,
      });
    }

    res.status(200).json(result);

  } catch (error) {
    console.log("Error comparing budget plans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { compareBudgetPlans };