const express = require('express')
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const verifyToken = require('../middlewares/verifytoken')
const {AddExpense, getBudgetInfo, getBudgetplanning} = require('../controller/ExpenseHandling')
const {GetExpense}=require('../controller/ExpenseHandling')
const {GetExpenseByfilter}=require('../controller/ExpenseHandling')
const {createBudgetPlan}=require('../controller/ExpenseHandling')
const {deleteExpense}=require('../controller/ExpenseHandling')
const {compareBudgetPlans}=require('../controller/Report');
const {  ActiveBudget, getAllBudgetsForUSer } = require('../controller/BudgetHandling');
const { dailyCheck } = require('../controller/BudgetHandling');
const { getBudgetTrend,getAllBudgets } = require('../controller/BudgetHandling');
const { getCategorySummary } = require('../controller/BudgetHandling');
const { GetActiveBudgetExpense } = require('../controller/ExpenseHandling');
const { getTodaySaving ,deleteBudget} = require('../controller/BudgetHandling');

router.post('/expense',AddExpense)
router.get('/expense',GetExpense)
router.get('/active-budget-expense',GetActiveBudgetExpense)
router.delete('/expense/:id',deleteExpense)
router.get('/filteredexpense',GetExpenseByfilter)
router.post('/Budgetplan',createBudgetPlan)
router.get('/getBudgetinfo',getBudgetInfo)
router.get('/getspentmoney',getBudgetplanning)
router.get('/report',compareBudgetPlans)
router.get('/getall/:userId',getAllBudgetsForUSer)
router.get('/getall',getAllBudgets)
router.post('/setactive/:id', ActiveBudget)
router.get("/daily-check/:userId", dailyCheck);
router.get("/budget-trend/:userId", getBudgetTrend);
router.get("/category-summary/:userId", getCategorySummary);
router.get("/today-saving/:userId", getTodaySaving);
router.delete("/delete-budget/:id", deleteBudget);





module.exports = router;