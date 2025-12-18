// controllers/expenseController.js
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const UserFinancio = require("../models/User");
const BudgetPlan = require("../models/Budget");
const { sendEmail } = require("../service/emailService");

// ADD EXPENSE
const AddExpense = async (req, res) => {
  const { userId, amount, category,item, date } = req.body;
  try {
    const expense = new Expense({ userId, amount, category,item, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error saving expense", error });
  }
};

// GET EXPENSES
const GetExpense = async (req, res) => {
  const { userId } = req.query;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

const GetActiveBudgetExpense = async (req, res) => {
  const { userId } = req.query;

  try {
    // Step 1: Active budget find
    const activeBudget = await BudgetPlan.findOne({ userId, isActive: true });
    if (!activeBudget) {
      return res.status(404).json({ message: "No active budget found" });
    }

    // Step 2: Today start & end time
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // Step 3: User ke aaj wale expenses
    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1 });
    // Step 4: Calculate total spent today
    const todaySpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json(expenses);

  } catch (error) {
    console.error("GetActiveBudgetExpense error:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};



// DELETE EXPENSE
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "id not found" });
    return res.status(201).json({ message: "successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting expense" });
  }
};

// FILTER EXPENSES
const GetExpenseByfilter = async (req, res) => {
  console.log("GetExpenseByfilter called with query:", req.query);
  try {
    const { userId, startDate, endDate, type } = req.query;
    const filter = { userId };
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const expenses = await Expense.find(filter).sort({ date: -1 });
    const moneySpend = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });
    const totalSpent = moneySpend.reduce((sum, item) => sum + item.amount, 0);
    let result = { expenses, totalSpent };
    console.log("Filtered expenses result:", result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Generate end date
function generateEndDate(budgetType, startDate) {
  const date = new Date(startDate);
  if (budgetType === "weekly") date.setDate(date.getDate() + 7);
  if (budgetType === "monthly") date.setMonth(date.getMonth() + 1);
  if (budgetType === "yearly") date.setFullYear(date.getFullYear() + 1);
  return date;
}

// CREATE NEW BUDGET PLAN
const createBudgetPlan = async (req, res) => {
  try {
    const { userId, budgetType, Budgetdate, budgetamount } = req.body;
    if (!userId || !budgetType || !Budgetdate || !budgetamount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const startDate = new Date(Budgetdate);
    const endDate = generateEndDate(budgetType, startDate);

    // Check duplicate (user, type, startDate)
    const alreadyExists = await BudgetPlan.findOne({
      userId,
      budgetType,
      startDate,
    });
    if (alreadyExists) {
      return res.status(409).json({ message: "Budget already exists!" });
    }


     // 🔍 Count how many budgets user already created
    const totalBudgets = await BudgetPlan.countDocuments({ userId });

    // ❌ If user already has 3, do not allow creation
    if (totalBudgets >= 3) {
      return res.status(403).json({
        message: "You can only create a maximum of 3 budget plans.",
      });
    }

    const newPlan = await BudgetPlan.create({
      userId,
      budgetType,
      startDate,
      endDate,
      budgetamount,
    });

    return res.status(201).json({
      message: "Budget planned successfully",
      data: newPlan,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper: find active budget for user; fallback: latest
async function findActiveOrLatestBudget(userId) {
  // try active first
  let budget = await BudgetPlan.findOne({ userId, isActive: true });
  if (!budget) {
    const latest = await BudgetPlan.find({ userId }).sort({ createdAt: -1 }).limit(1);
    budget = latest && latest.length ? latest[0] : null;
  }
  return budget;
}

// GET LATEST BUDGET PLAN + SPENDING STATUS (but prefers active budget)
const getBudgetplanning = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) return res.status(400).json({ message: "userId required" });

    const budgetPlan = await findActiveOrLatestBudget(userId);
    if (!budgetPlan) return res.status(404).json({ message: "No budget plans found" });

    const { budgetType, startDate, endDate, budgetamount } = budgetPlan;

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const leftoverBudget = budgetamount - totalSpent;
    const spentPercent = budgetamount > 0 ? (totalSpent / budgetamount) * 100 : 0;

    // 90% ALERT
    if (spentPercent >= 90) {
      const user = await UserFinancio.findById(userId);
     if (spentPercent >= 90) {
  const user = await UserFinancio.findById(userId);

  if (user?.email) {
    await sendEmail(
      user.email,
      "⚠️ Financio Alert: Budget Almost Finished",
      `
      <div style="font-family:Arial; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,0.1); overflow:hidden;">

          <div style="background:#dc2626; color:white; padding:16px; text-align:center;">
            <h2 style="margin:0;">⚠️ Budget Alert</h2>
          </div>

          <div style="padding:20px; color:#333;">
            <p>Hi <b>${user.name || "User"}</b>,</p>

            <p>
              You have used 
              <b style="color:#dc2626;">${spentPercent.toFixed(1)}%</b>
              of your total budget.
            </p>

            <div style="background:#f9fafb; padding:15px; border-radius:8px; border:1px solid #e5e7eb;">
              <p>💰 <b>Total Budget:</b> ₹${budgetamount}</p>
              <p>📉 <b>Spent:</b> ₹${totalSpent}</p>
              <p>🟢 <b>Remaining:</b> ₹${leftoverBudget}</p>
            </div>

            <p style="margin-top:15px; font-size:14px; color:#555;">
              Please review your expenses to stay within your budget.
            </p>

            <div style="text-align:center; margin-top:20px;">
              <span style="background:#111827; color:white; padding:10px 18px; border-radius:6px; font-size:14px;">
                Financio Budget Manager
              </span>
            </div>
          </div>

          <div style="background:#f3f4f6; text-align:center; padding:10px; font-size:12px; color:#6b7280;">
            © ${new Date().getFullYear()} Financio
          </div>
        </div>
      </div>
      `
    );
  }
}

    }

    res.status(200).json({
      totalSpent,
      period: budgetType,
      startDate,
      endDate,
      budgetamount,
      leftoverBudget,
      MoneySpend_as_budget: expenses,
      budgetId: budgetPlan._id,
      isActive: budgetPlan.isActive,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// FETCH ONLY LATEST (or active) BUDGET INFO (NO CALCULATION)
const getBudgetInfo = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) return res.status(400).json({ message: "userId required" });
    const budget = await findActiveOrLatestBudget(userId);
    if (!budget) return res.status(404).json({ message: "No budget found" });
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET SPENT MONEY FOR ACTIVE (or latest fallback) budget
const getspentmoney = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const budget = await findActiveOrLatestBudget(userId);
    if (!budget) return res.status(404).json({ message: "No budget found" });

    const { startDate, endDate, budgetamount, budgetType } = budget;

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const leftoverBudget = budgetamount - totalSpent;

    res.status(200).json({
      totalSpent,
      leftoverBudget,
      period: budgetType,
      startDate,
      endDate,
      budgetamount,
      MoneySpend_as_budget: expenses,
      budgetId: budget._id,
      isActive: budget.isActive,
    });
  } catch (err) {
    console.error("getspentmoney error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// SET ACTIVE BUDGET (deactivate others, activate chosen)
const ActiveBudget = async (req, res) => {
  try {
    const { userId, budgetId } = req.body;
    if (!userId || !budgetId) return res.status(400).json({ message: "userId & budgetId required" });

    await BudgetPlan.updateMany({ userId }, { $set: { isActive: false } });
    await BudgetPlan.findByIdAndUpdate(budgetId, { isActive: true });

    res.status(200).json({ message: "Budget Activated Successfully" });
  } catch (err) {
    console.error("ActiveBudget error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBudgets = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log("userId received:", userId);

        

        const budgets = await BudgetPlan.find({ userId });

        return res.json({
            budgets
        });

    } catch (err) {
        console.log("ERROR in getAllBudgets:", err);   // ✅ important
        return res.status(400).json({
            msg: "Server Error",
            error: err.message
        });
    }
};


module.exports = {
  AddExpense,
  GetExpense,
  GetExpenseByfilter,
  deleteExpense,
  createBudgetPlan,
  getBudgetplanning,
  getBudgetInfo,
  getspentmoney,
  ActiveBudget,
  getAllBudgets,
  GetActiveBudgetExpense,
};
