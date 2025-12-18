const express = require('express');
const connectDB = require('./config/dbConnection')
const dotenv = require('dotenv');
const cors = require('cors')





// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect to MongoDB
connectDB();



const authRoutes = require('./routes/UserRoutes');

// Use auth routes
app.use('/auth', authRoutes);
const IncomeRoute = require('./routes/UserIncomeRoute')
app.use('/api',IncomeRoute)

const expenseRoute =require('./routes/ExpenseRoute')
app.use('/exp',expenseRoute)











// for deletion of expired budget 
const BudgetPlan = require("./models/Budget"); 

// 🟦 SERVER START PE EXPIRED BUDGET AUTO DELETE
async function deleteExpiredOnStart() {
  try {
    // 2 din pehle ka datetime
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const result = await BudgetPlan.deleteMany({
      endDate: { $lte: twoDaysAgo }
    });

    console.log("🔁 Deleted budgets older than 2 days:", result.deletedCount);
  } catch (err) {
    console.error("❌ Error deleting 2-day-old budgets:", err);
  }
}

deleteExpiredOnStart();











// Set port
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
