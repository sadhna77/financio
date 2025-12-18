const Income = require("../models/Income");
const Expense = require("../models/Expense");
const UserFinancio = require("../models/User");
const BudgetPlan = require("../models/Budget");
const { sendEmail } = require("../service/emailService");
const mongoose = require('mongoose');


const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const ActiveBudget = async (req, res) => {
    console.log("Activating budget with data:---", req.body, req.params);
  const { userId } = req.body;
  const budgetId = req.params.id;

  await BudgetPlan.updateMany(
    { userId },
    { $set: { isActive: false } }     // sab inactive
  );

  await BudgetPlan.findByIdAndUpdate(
    budgetId,
    { isActive: true }                // selected budget active
  );

  res.json({ message: "Budget Activated Successfully" });
};



const getAllBudgets = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Fetch all budgets created by this user
    const budgets = await BudgetPlan.find({ userId })
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      budgets,
    });

  } catch (error) {
    console.error("Error fetching budgets:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching budgets",
    });
  }
}




const dailyCheck = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find ANY active budget (weekly / monthly / yearly)
    const budget = await BudgetPlan.findOne({
      userId,
      isActive: true
    });

    if (!budget) {
      return res.status(409).json({ error: "No active budget found" });
    }

    // 2. Calculate average daily limit based on budgetType
    let avgDailyLimit = 0;

    if (budget.budgetType === "weekly") {
      avgDailyLimit = budget.budgetamount / 7;
    } 
    else if (budget.budgetType === "monthly") {
      avgDailyLimit = budget.budgetamount / 30;  // approx month days
    } 
    else if (budget.budgetType === "yearly") {
      avgDailyLimit = budget.budgetamount / 365;
    }

    // 3. Today range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 4. Get total spent today from DB
    const expenses = await Expense.find({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    const totalTodaySpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 5. Compare avg vs today
    let status = "equal";

    if (totalTodaySpent > avgDailyLimit) {
      status = "high";
    } else if (totalTodaySpent < avgDailyLimit) {
      status = "low";
    }

    // 6. Return result
    return res.json({
      activeBudgetType: budget.budgetType,
      avgDailyLimit: Math.round(avgDailyLimit),
      todaySpent: totalTodaySpent,
      status
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};



// Weights for weekend/festival
const weights = {
  normal: 1,
  saturday: 1.5,
  sunday: 2,
  festival: 3
};

// Example fixed holidays MM-DD
const FIXED_FESTIVALS = ["01-01", "12-25", "10-02"];

const getBudgetTrend = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Get active budget
    const budget = await BudgetPlan.findOne({ userId, isActive: true });
    if (!budget)
      return res.status(404).json({ message: "No active budget found" });

    const budgetAmount = budget.budgetamount;
    const startDate = new Date(budget.startDate);  // budget start date
    const endDate = new Date(budget.endDate);      // budget end date
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);

    const totalDays = Math.ceil((endDate - startDate) / (1000*60*60*24)) + 1;

    // 2️⃣ Build dateList with weights
    const dateList = [];
    let totalWeight = 0;
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      let dayWeight = weights.normal;
      const day = d.getDay();

      // weekend
      if(day === 6) dayWeight = weights.saturday;
      if(day === 0) dayWeight = weights.sunday;

      // festival
      const mmdd = `${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      if(FIXED_FESTIVALS.includes(mmdd)) dayWeight = weights.festival;

      dateList.push({ date: d, weight: dayWeight });
      totalWeight += dayWeight;
    }

    // 3️⃣ Expected trend
    const expectedTrend = dateList.map(item => {
      const expectedToday = (budgetAmount * item.weight)/totalWeight;
      return { 
        date: item.date.toISOString().split("T")[0],
        expected: Math.round(expectedToday)
      };
    });

    // 4️⃣ Actual trend
  const expenses = await Expense.aggregate([
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId), // <--- convert
      date: { $gte: startDate, $lte: endDate }
    }
  },
  {
    $group: {
      _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } },
      total: { $sum: "$amount" }
    }
  },
  { $sort: { "_id.date": 1 } }
]);


    const actualTrendMap = {};
    expenses.forEach(e => {
      actualTrendMap[e._id.date] = e.total;
    });

    // 5️⃣ Merge expected + actual
    const finalTrend = expectedTrend.map(e => ({
      date: e.date,
      expected: e.expected,
      actual: actualTrendMap[e.date] || 0  // 0 if no expense
    }));

    return res.status(200).json({
      budgetType: budget.budgetType,
      budgetAmount,
      trend: finalTrend
    });

  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};



const getCategorySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "UserId required" });

    // Get active budget
    const activeBudget = await BudgetPlan.findOne({ userId, isActive: true });
    if (!activeBudget) return res.json([]);

    const startDate = new Date(activeBudget.startDate);
    const endDate = new Date(activeBudget.endDate);
    

    const summary = await Expense.aggregate([
      {
        $match: {
userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          _id: 0,
        },
      },
    ]);

    res.json(summary);

  } catch (err) {
    console.error("Error getting category summary", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTodaySaving = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find ACTIVE budget
    const budget = await BudgetPlan.findOne({
      userId,
      isActive: true,
    });

    if (!budget) {
      return res.status(404).json({ message: "No active budget found" });
    }

    // 2. Calculate daily limit
    let avgDailyLimit = 0;

    if (budget.budgetType === "weekly") {
      avgDailyLimit = budget.budgetamount / 7;
    } else if (budget.budgetType === "monthly") {
      avgDailyLimit = budget.budgetamount / 30;
    } else if (budget.budgetType === "yearly") {
      avgDailyLimit = budget.budgetamount / 365;
    }

    avgDailyLimit = Math.round(avgDailyLimit);

    // 3. Today range
    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 4. Total spent today
    const expenses = await Expense.find({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    const todaySpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 5. Calculate today's saving
    const diff = avgDailyLimit - todaySpent;
    const todaySaved = diff > 0 ? diff : 0;

    return res.status(200).json({
      avgDailyLimit,
      todaySpent,
      todaySaved
    });

  } catch (err) {
    console.error("Saving check error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllBudgetsForUSer = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message:"Invalid userId" });
    }

    const budgets = await BudgetPlan.find({ userId }).sort({ createdAt:-1 });

    const results = [];

    for (let b of budgets) {
      
      // get total spent in this budget range
      const spent = await Expense.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: b.startDate, $lte: b.endDate }
          }
        },
        {
          $group: {
            _id:null,
            total: {$sum:"$amount"}
          }
        }
      ]);

      const totalSpent = spent[0]?.total || 0;

      // loss = budget - spent
      const loss = b.budgetamount - totalSpent;

      let status = "equal";
      if (totalSpent > b.budgetamount) status = "high";
      if (totalSpent < b.budgetamount) status = "low";

      results.push({
        _id: b._id,
        budgetType: b.budgetType,
        budgetamount: b.budgetamount,
        startDate: b.startDate,
        endDate: b.endDate,
        spent: totalSpent,
        loss,
        status
      });
    }

    return res.status(200).json({
      success:true,
      budgets: results
    });

  } catch(err){
    console.error(err);
    return res.status(500).json({ message:"Server Error", error:err.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;      // budgetId
    const { userId } = req.body;    // ensure user owns the budget

    if (!id || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Budget ID and User ID required" 
      });
    }

    // Check if budget exists & belongs to the user
    const budget = await BudgetPlan.findOne({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found or unauthorized"
      });
    }

    // Delete budget
    await BudgetPlan.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully"
    });

  } catch (err) {
    console.error("Delete Budget Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error while deleting budget",
      error: err.message
    });
  }
};







module.exports = {
  ActiveBudget,
  getAllBudgets,
  getAllBudgetsForUSer,
  dailyCheck,
  getBudgetTrend,
  getCategorySummary,
  getTodaySaving,
    deleteBudget

};