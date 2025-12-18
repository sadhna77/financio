// src/pages/Income.jsx  (or wherever you keep it)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { IoAddOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { FaHeart } from "react-icons/fa6";
import { FaFaceSmileBeam } from "react-icons/fa6";
import { ArrowUpRight, ArrowDownRight, Briefcase, User } from "lucide-react";
import { BsCoin } from "react-icons/bs";

import BudgetHandling from "./BudgetHandling.jsx";
import { useUserContext } from "./Context/UserContext";
import { useTheme } from "./Context/ThemeContext";
import TotalSalary from "./TotalIncome.jsx";
import DonutExpenseTable from "./DonutPieChart.jsx";
import BudgetMeter from "./BudgetMeter.jsx";
import { useLocation } from "react-router-dom";


const Income = () => {
  const { userId, setExpenses, expenses } = useUserContext();
  const { theme } = useTheme();

  // income object
  const [income, setIncome] = useState({
    salary: "",
    bonus: "",
    sideIncome: "",
  });
  const [incomeExist, setIncomeExist] = useState(false);

  // UI states
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // budget planning states
  const [budgetType, setBudgetType] = useState("monthly");
  const [budgetamount, setBudgetamount] = useState("");
  const [Budgetdate, setBudgetdate] = useState("");

  // budget info & spent values (use active budget)
  const [budgetInfo, setBudgetInfo] = useState(null); // single object (active or latest)
  const [spentMoney, setSpentMoney] = useState(0);
  const [leftoverBudget, setLeftoverBudget] = useState(0);

  const [legendData, setLegendData] = useState([]);
  const [spendChartData, setSpendChartData] = useState([]);









  const location = useLocation();

useEffect(() => {
  
  // 🔥 Scroll ONLY if navigation state exists
  if (!location.state?.scrollTo) return;

  const target = document.getElementById(location.state.scrollTo);

  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }
}, [location]);


  const handleChange = (e) => {
    setIncome((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      await axios.post(
        "https://financio-qskj.onrender.com/api/income",
        { ...income, userId },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      toast.success("Income saved");
      fetchIncome();
      setIsOpen(false);
    } catch (err) {
      console.error("Error saving income:", err);
      toast.error("Error saving income");
    }
  };

  // income chart data
  const incomeChartData = [
    { name: "Salary", value: Number(income.salary) || 0 },
    { name: "Bonus", value: Number(income.bonus) || 0 },
    { name: "Side Income", value: Number(income.sideIncome) || 0 },
  ];

  const fetchIncome = async () => {
    if (!userId) return;
    try {
      const res = await axios.get("https://financio-qskj.onrender.com/api/income", {
        params: { userId },
      });
      const incomeData = res.data[0] || {};
      setIncome({
        salary: incomeData.salary ?? "",
        bonus: incomeData.bonus ?? "",
        sideIncome: incomeData.sideIncome ?? "",
      });
      setIncomeExist(Array.isArray(res.data) && res.data.length > 0);
    } catch (error) {
      console.log("Error fetching income:", error);
    }
  };

  const fetchExpenses = async () => {
    if (!userId) return;
    try {
      const res = await axios.get("https://financio-qskj.onrender.com/exp/expense", {
        params: { userId },
      });
      const expenseData = Array.isArray(res.data) ? res.data : [];
      // aggregate by category
      const categoryTotals = {};
      expenseData.forEach((item) => {
        const amt = Number(item.amount) || 0;
        if (categoryTotals[item.category]) categoryTotals[item.category] += amt;
        else categoryTotals[item.category] = amt;
      });
      const spendData = Object.keys(categoryTotals).map((category) => ({
        name: category,
        value: categoryTotals[category],
      }));
      setSpendChartData(spendData);
      const sortedSpendData = [...spendData].sort((a, b) => b.value - a.value);
      setLegendData(sortedSpendData.slice(0, 5));
      // setExpenses(expenseData); // optional
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  // fetch active (or latest) budget info
  const getBudgetPlanning = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://financio-qskj.onrender.com/exp/getBudgetplanning`,
        {
          params: { userId },
        }
      );
      // getBudgetplanning returns totals and meta for active/latest budget
      setBudgetInfo(res.data || null);
      // also set fields used for progress
      setSpentMoney(Number(res.data?.totalSpent || 0));
      setLeftoverBudget(Number(res.data?.leftoverBudget || 0));
    } catch (error) {
      console.error("Error fetching budget planning:", error);
      setBudgetInfo(null);
      setSpentMoney(0);
      setLeftoverBudget(0);
    }
  };

  // alternative endpoint (if you prefer), get only budget info (no totals)
  const getBudgetInfo = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`https://financio-qskj.onrender.com/exp/getBudgetinfo`, {
        params: { userId },
      });
      setBudgetInfo(res.data || null);
    } catch (error) {
      console.error("Error fetching budget info:", error);
      setBudgetInfo(null);
    }
  };

  // getspentmoney still available - will also calculate totals for active
  const getSpentMoney = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`https://financio-qskj.onrender.com/exp/getspentmoney`, {
        params: { userId },
      });
      const data = res.data || {};
      setSpentMoney(Number(data.totalSpent || 0));
      setLeftoverBudget(Number(data.leftoverBudget || 0));
      // store budgetInfo from this response too
      setBudgetInfo({
        budgetamount: data.budgetamount,
        period: data.period,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
        budgetId: data.budgetId,
      });
    } catch (error) {
      console.error("Error fetching spent money:", error);
      setSpentMoney(0);
      setLeftoverBudget(0);
    }
  };

  useEffect(() => {
    fetchIncome();
    fetchExpenses();
    // initial budget info and spent values
    getBudgetPlanning();
    getSpentMoney();
  }, [userId]);

  // Called when BudgetHandling changes active budget
  const handleActiveChange = async () => {
    await getBudgetPlanning();
    await getSpentMoney();
    // also refresh other UI parts if needed
    fetchExpenses();
  };

  // Plan budget handler
  const handleBudgetPlan = async () => {
    if (!userId) {
      toast.error("Please login first", { duration: 2000 });
      return;
    }
    if (!budgetamount || !Budgetdate) {
      toast.error("Please enter budget amount and date", { duration: 2000 });
      return;
    }
    try {
      await axios.post("https://financio-qskj.onrender.com/exp/Budgetplan", {
        userId,
        budgetType,
        Budgetdate,
        budgetamount: Number(budgetamount) || 0,
      });
      toast.success("Budget planned successfully!", { duration: 2000 });
      // refresh
      getBudgetPlanning();
      getSpentMoney();
    } catch (error) {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.message ===
          "You can only create a maximum of 3 budget plans."
      ) {
        toast.warning(
          "You already have 3 budget plans. Delete one to create new.",
          {
            duration: 2500,
          }
        );
        return;
      }

      // 🔥 Handle duplicate budget
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data.message === "Budget already exists!"
      ) {
        toast.error("This budget already exists for selected date!", {
          duration: 2500,
        });
        return;
      }
      console.error("some error in budget planning", error);
      toast.error("Error planning budget", { duration: 2000 });
    }
  };

  // Progress calculations based on active budget
  const currentBudgetAmount = Number(budgetInfo?.budgetamount || 0);
  const rawPercent =
    currentBudgetAmount > 0
      ? (Number(spentMoney) / currentBudgetAmount) * 100
      : 0;
  const percentageSpent = Math.min(Math.max(Number(rawPercent) || 0, 0), 100);
  const percentageDisplay = Number(percentageSpent.toFixed(1));

  let progressColorClass = "bg-green-500";
  if (percentageSpent > 90) progressColorClass = "bg-red-500";
  else if (percentageSpent > 75) progressColorClass = "bg-yellow-400";
  else progressColorClass = "bg-green-500";

  const totalIncome =
    (Number(income.salary) || 0) +
    (Number(income.bonus) || 0) +
    (Number(income.sideIncome) || 0);

  const COLORS = [
    "#007bff",
    "#ff6b6b",
    "#51cf66",
    "#ffd43b",
    "#845ef7",
    "#20c997",
    "#ff922b",
    "#339af0",
    "#f783ac",
    "#a29bfe",
  ];

  return (
    <div
      className={`${
        theme === "dark"
          ? "text-white bg-black"
          : "text-[#B33791] hover:bg-gray-100"
      }`}
    >
      {/* pass handler to child so parent refreshes on active change */}
      <BudgetHandling onActiveChange={handleActiveChange} />

      {/* budget planning UI */}
      <div className="p-4 rounded-md border border-[#938c91] mt-5 ">
        <h2 className="text-2xl font-bold mb-4 text-[#c10c90] pt-5">
          Your Budget Planning
        </h2>

        <div className="flex flex-col sm:flex-row gap-5">
          <select
            value={budgetType}
            onChange={(e) => setBudgetType(e.target.value)}
            className="border border-gray-300 rounded text-sm focus:outline-none p-2 focus:ring-2 focus:ring-[#b05598]"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>

          <Input
            type="number"
            placeholder="How much you want to spend"
            value={budgetamount}
            onChange={(e) => setBudgetamount(e.target.value)}
          />

          <Input
            type="date"
            value={Budgetdate}
            onChange={(e) => setBudgetdate(e.target.value)}
            className={`appearance-none px-3 py-2 rounded 
              ${
                theme === "dark"
                  ? "bg-black text-white placeholder-gray-200 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-datetime-edit-fields-wrapper]:text-gray-400"
                  : "bg-white text-black placeholder-gray-500"
              }`}
          />

          <Button className="bg-[#037c1f]" onClick={handleBudgetPlan}>
            Plan
          </Button>
        </div>

        {/* progress bar */}
        <div className="pt-5">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${progressColorClass}`}
              style={{ width: `${percentageSpent}%` }}
            />
          </div>

          <div className="flex flex-row justify-between font-sans text-gray-400 mt-2">
            <div className="flex flex-col">
              <p className="text-red-500">₹ {currentBudgetAmount || 0}</p>
              <p>Spent Money: ₹{spentMoney}</p>
              <p>
                BudgetType:{" "}
                {budgetInfo?.period || budgetInfo?.budgetType || "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-green-500">{percentageDisplay} %</p>
              <p>Money Left: ₹{leftoverBudget}</p>
            </div>
          </div>
        </div>
      </div>

      {/* charts */}
      <div className="flex flex-row md:flex-row gap-4 mt-6">
        <Card
          className={`w-full md:w-1/2 flex items-center ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <BudgetMeter theme={theme} />
        </Card>

        {/* ---------------------------------------------donut chart with table------------------------------------------------- */}
        <Card
          className={`w-full md:w-1/2 flex items-center ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <DonutExpenseTable />
        </Card>
      </div>

      <div  id="income-edit-section" className="flex items-center gap-32 mt-8 md:flex-row sm:flex-col ">
        {incomeExist ? (
          <div className="ml-5 font-Hubot text-[#785a70]">
            <FaFaceSmileBeam color="#4e033a" size={50} />
            income already exist{" "}
            <p
              className="text-green-600 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              Edit
            </p>
          </div>
        ) : (
          <div
            onClick={() => setIsOpen(true)}
            className={`cursor-pointer p-2 h-50 w-70 flex items-center justify-center flex-col hover:border-2 rounded-2xl ${
              theme === "dark"
                ? "bg-[#31032591] text-white"
                : "bg-white text-black"
            }`}
          >
            <p className="font-Hubot text-[#785a70]"> add income per annum </p>
            <IoAddOutline size={40} />
            Add Income
          </div>
        )}

        <TotalSalary income={totalIncome} />
      </div>

      {/* Drawer for add/edit income */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="w-[80%] mx-auto bg-sky-100 font-Hubot">
          <DrawerHeader>
            <DrawerTitle>Add Income Member</DrawerTitle>
            <DrawerDescription>Fill the details below.</DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <div className="space-y-2 border-blue-950 pb-2">
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={income.salary}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                name="bonus"
                placeholder="Bonus"
                value={income.bonus}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                name="sideIncome"
                placeholder="Side Income"
                value={income.sideIncome}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          <DrawerFooter>
            <button
              onClick={handleSave}
              className={`cursor-pointer text-white px-4 py-2 rounded  active:bg-[#2c0221] ${
                theme === "dark"
                  ? "bg-gray-900 text-white"
                  : "bg-[#b05598] text-black"
              } `}
            >
              Save
            </button>
            <DrawerClose>
              <button className="border w-full cursor-pointer px-4 py-2 rounded hover:border-2">
                Cancel
              </button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Income;
