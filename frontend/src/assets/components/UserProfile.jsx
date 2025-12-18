import React, { useEffect, useState } from "react";
import moneybagDark from "../../assets/budget90.jpg";
import moneybagLight from "../../assets/lightimage.jpg";
import { useTheme } from "./Context/ThemeContext";
import { useUserContext } from "./Context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const { theme } = useTheme();
  const { userId } = useUserContext();
  const navigate = useNavigate();

  // Choose image based on theme
  const headerImage = theme === "dark" ? moneybagDark : moneybagLight;

  const [income, setIncome] = useState({
    salary: "",
    bonus: "",
    sideIncome: "",
  });

  // Fetch income
  const fetchIncome = async () => {
    if (!userId) return;
    try {
      const res = await axios.get("http://localhost:3000/api/income", {
        params: { userId },
      });

      const incomeData = res.data[0] || {};
      setIncome({
        salary: incomeData.salary || "",
        bonus: incomeData.bonus || "",
        sideIncome: incomeData.sideIncome || "",
      });
    } catch (error) {
      console.log("Error fetching income:", error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [userId]);

  // Navigation + Auto Scroll
  const goToIncomeEdit = () => {
    navigate("/dashboard/income", { state: { scrollTo: "income-edit-section" } });
  };
  const goToExpenseEdit = () => {
    navigate("/dashboard/income", { state: { scrollTo: "expense-edit-section" } });
  };
  const goToSaveEdit = () => {
    navigate("/dashboard/income", { state: { scrollTo: "expense-edit-section" } });
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen ${
        theme === "dark" ? "bg-black text-[#B33791]" : "bg-[#12020e] text-white"
      }`}
    >
      {/* 🔹 Hero Section */}
      <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden rounded-b-[40px] shadow-lg">
        {/* Background Image */}
        <img
          src={headerImage}
          alt="Budget Header"
          className="w-full h-full object-cover scale-105 transition-all duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90"></div>

        {/* Text Over Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#B33791] drop-shadow-xl tracking-wide">
            Budget Planner
          </h1>
          <p className="text-gray-300 mt-3 text-sm sm:text-base font-light">
            Track your spending & build better financial habits
          </p>
        </div>
      </div>

      {/* 🔹 Summary Card */}
      <div
        className={`w-[90%] max-w-4xl rounded-3xl shadow-xl p-6 -mt-12 z-10 backdrop-blur-xl border ${
          theme === "dark"
            ? "bg-[#0a0a0acc] border-[#B33791]/20"
            : "bg-[#1b0b17cc] border-[#B33791]/20"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center">
            <h2 className="text-sm text-gray-400">Total Income</h2>
            <p className="text-2xl font-bold text-green-400">₹ {income.salary}</p>
          </div>

          <div className="text-center">
            <h2 className="text-sm text-gray-400">Total Expenses</h2>
            <p className="text-2xl font-bold text-red-400">₹ 20,500</p>
          </div>

          <div className="text-center">
            <h2 className="text-sm text-gray-400">Remaining Balance</h2>
            <p className="text-2xl font-bold text-blue-400">₹ 29,500</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <h3 className="text-sm text-gray-400 mb-2">Budget Usage</h3>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: "41%" }}
            ></div>
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">41% used</p>
        </div>
      </div>

      {/* 🔹 Cards Section */}
      <div className="w-[90%] max-w-4xl mt-10 grid sm:grid-cols-3 gap-6">
        {/* Income */}
        <div
          className={`p-6 rounded-2xl shadow-lg hover:shadow-2xl transition border ${
            theme === "dark"
              ? "bg-[#0b0b0b] border-[#B33791]/20"
              : "bg-[#130710] border-[#B33791]/20"
          }`}
        >
          <h3 className="text-lg font-semibold text-white mb-2">Income</h3>
          <p className="text-sm text-gray-400 mb-4">Manage all your income sources.</p>

          <button
            onClick={goToIncomeEdit}
            className="bg-green-500 hover:bg-green-600 w-full text-white px-4 py-2 rounded-lg"
          >
            + Add Income
          </button>
        </div>

        {/* Expenses */}
        <div
          className={`p-6 rounded-2xl shadow-lg hover:shadow-2xl transition border ${
            theme === "dark"
              ? "bg-[#0b0b0b] border-[#B33791]/20"
              : "bg-[#130710] border-[#B33791]/20"
          }`}
        >
          <h3 className="text-lg font-semibold text-white mb-2">Expenses</h3>
          <p className="text-sm text-gray-400 mb-4">
            Track your daily spending easily.
          </p>

          <button
            onClick={goToExpenseEdit}
            className="bg-red-500 hover:bg-red-600 w-full text-white px-4 py-2 rounded-lg"
          >
            + Add Expense
          </button>
        </div>

        {/* Savings */}
        <div
          onClick={goToSaveEdit}
          className={`p-6 rounded-2xl shadow-lg hover:shadow-2xl transition border ${
            theme === "dark"
              ? "bg-[#0b0b0b] border-[#B33791]/20"
              : "bg-[#130710] border-[#B33791]/20"
          }`}
        >
          <h3 className="text-lg font-semibold text-white mb-2">Savings</h3>
          <p className="text-sm text-gray-400 mb-4">Monitor your total savings.</p>

          <button className="bg-blue-500 hover:bg-blue-600 w-full text-white px-4 py-2 rounded-lg">
            View Savings
          </button>
        </div>
      </div>
    </div>
  );
};
