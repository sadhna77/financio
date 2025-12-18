import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "./Context/UserContext";

// ICONS
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa6";
import { FaRegSmile, FaSmileBeam, FaMeh, FaFrown } from "react-icons/fa";



const BudgetHandling = () => {
  const { userId } = useUserContext();
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`https://financio-qskj.onrender.com/exp/getall`, {
        params: { userId },
      });

      setBudgets(res.data.budgets);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // set active budget
  const setActiveBudget = async (budgetId) => {
    try {
      await axios.post(`https://financio-qskj.onrender.com/exp/setactive/${budgetId}`, {
        userId,
      });

      fetchBudgets();
    } catch (error) {
      console.log("Active error:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [userId]);

  // extract budgets
  const weekly = budgets.find((b) => b.budgetType === "weekly");
  const monthly = budgets.find((b) => b.budgetType === "monthly");
  const yearly = budgets.find((b) => b.budgetType === "yearly");

  // DAILY STATUS FETCH
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datastatus, setDatastatus] = useState("");
  const [todaySpent, setTodaySpent] = useState(1);
  const [dailyLimit, setDailyLimit] = useState(1);
  const [percentage, setPercentage] = useState(0);

  const fetchDailyCheck = async () => {
    try {
      const res = await axios.get(
        `https://financio-qskj.onrender.com/exp/daily-check/${userId}`
      );


setData(res.data);

setTodaySpent(res.data.todaySpent);
setDailyLimit(res.data.avgDailyLimit);
setDatastatus(res.data.status);

// calculate percentage spent
let percent =
  res.data.avgDailyLimit > 0
    ? (res.data.todaySpent / res.data.avgDailyLimit) * 100
    : 0;

// cap percentage to 100 for progress bar display
if (percent > 100) percent = 100;

setPercentage(percent);

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyCheck();
  }, [userId]);

  if (loading)
    return <p className="text-gray-400">Checking today’s spending...</p>;

  if (!data)
    return <p className="text-red-500">No active budget found.</p>;

  // Arrow + text color for all cards
  const statusColor =
    datastatus === "high"
      ? "text-red-500"
      : datastatus === "low"
      ? "text-green-500"
      : "text-yellow-400";

  return (
    <div className="p-5 w-full">
      <div
        className="p-4 rounded-md border border-[#938c91] mt-5 
        grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <BudgetCard
          title="Weekly Budget"
          data={weekly}
          setActiveBudget={setActiveBudget}
          statusColor={statusColor}
          datastatus={datastatus}
          percentage={percentage}
        />

        <BudgetCard
          title="Monthly Budget"
          data={monthly}
          setActiveBudget={setActiveBudget}
          statusColor={statusColor}
          datastatus={datastatus}
                    percentage={percentage}

        />

        <BudgetCard
          title="Yearly Budget"
          data={yearly}
          setActiveBudget={setActiveBudget}
          statusColor={statusColor}
          datastatus={datastatus}
                    percentage={percentage}

        />
      </div>
    </div>
  );
};

export default BudgetHandling;

/* -------------------------------------------
        REUSABLE BUDGET CARD 
   -------------------------------------------*/
const BudgetCard = ({ title, data, setActiveBudget, statusColor, datastatus ,percentage}) => {
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "--");

  const handleActive = () => {
    if (!data) return;
    if (data.isActive) return;
    setActiveBudget(data._id);
  };

  // percentageSpent already defined from budget progress calculation
let BudgetIcon;
if (percentage <= 75) {
  BudgetIcon = <FaSmileBeam className="text-green-500 animate-bounce" />;
} else if (percentage <= 90) {
  BudgetIcon = <FaMeh className="text-yellow-400 animate-pulse" />;
} else {
  BudgetIcon = <FaFrown className="text-red-500 animate-shake" />;
}


  // Choose arrow icons
  const getStatusIcon = () => {
    if (!datastatus) return null;

    if (datastatus === "high")
      return <FaArrowUp className="text-red-500 text-xl" />;

    if (datastatus === "low")
      return <FaArrowDown className="text-green-500 text-xl" />;

    return <FaMinus className="text-yellow-400 text-xl" />;
  };

  return (
    <div
      className={`relative p-4 rounded-2xl border transition-all shadow-sm hover:shadow-xl 
        backdrop-blur-sm
        ${
          data?.isActive
            ? "border-[#d1119e] bg-[#2a0024]/70 dark:bg-[#2a0024]/50"
            : "border-[#938c91]/40 bg-white/5 dark:bg-black/40"
        }
      `}
    >
      {/* SMILE ICON */}
      <div className="absolute top-3 right-3 text-2xl">
        {data?.isActive ? (
         <div className="absolute top-3 right-3 text-2xl animate-bounce">
    {BudgetIcon}
  </div>
        ) : (
          <FaRegSmile className="text-gray-400 dark:text-gray-500" />
        )}
      </div>

      {/* ACTIVE BADGE */}
      {data?.isActive && (
        <div className="absolute top-3 left-3 bg-[#d1119e] text-white text-[10px] px-3 py-1 rounded-full shadow-md">
          ACTIVE NOW
        </div>
      )}

      {/* TITLE */}
      <h2 className="text-xl font-semibold mt-10 text-[#d1119e]">
        {title}
      </h2>

      {/* DATES */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Start: {formatDate(data?.startDate)}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        End: {formatDate(data?.endDate)}
      </p>

      {/* AMOUNT */}
      <p className="text-sm font-semibold text-[#938c91] mb-3">
        Amount: ₹{data?.budgetamount || "--"}
      </p>

      {/* STATUS + ICON */}
{data?.isActive && (
  <div className="flex items-center gap-2 mt-3">
    {getStatusIcon()}
    <span className={`text-lg font-bold ${statusColor}`}>
      {datastatus?.toUpperCase()}
    </span>
  </div>
)}


      {/* BUTTON */}
      {data ? (
        <button
          onClick={handleActive}
          disabled={data?.isActive}
          className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-all
          ${
            data?.isActive
              ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "bg-[#d1119e] text-white hover:bg-[#b10c81]"
          }
        `}
        >
          {data?.isActive ? "Already Active" : "Set Active"}
        </button>
      ) : (
        <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
          No {title} Created
        </p>
      )}
    </div>
  );
};
