import React, { useEffect, useState } from "react";
import { useUserContext } from "./Context/UserContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
  Cell,
} from "recharts";
import FilterMenu from "./FilterMenu";
import axios from "axios";
import { useTheme } from "./Context/ThemeContext";



export const Plot = () => {
  const { userId, } = useUserContext();
  const [chartData, setChartData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expenses, setExpenses] = useState([]);
    const { theme } = useTheme();
  
  // Fetch current year expenses on first load
useEffect(() => {
  const fetchDefaultData = async () => {
    try {
      const year = new Date().getFullYear();
      
      const startDate = new Date(year, 0, 1);   // 1 Jan
      const endDate = new Date(year, 11, 31);   // 31 Dec

      const res = await axios.get("http://localhost:3000/exp/filteredexpense", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userId,
        },
      });

      setExpenses(res.data.expenses);
      setRefreshKey(prev => prev + 1);

      console.log("Default Year Expense Loaded:", res.data);

    } catch (err) {
      console.log("Default load error:", err);
    }
  };

  fetchDefaultData();
}, [userId]);


  const handleFilter = async ({ startDate, endDate }, type) => {
    try {
      const res = await axios.get("http://localhost:3000/exp/filteredexpense", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userId,
        },
      });

setExpenses(res.data.expenses);
      console.log("Expenses after filtering:", res.data);


      // Force graph refresh
      setRefreshKey((prev) => prev + 1);

      
    } catch (error) {
      console.log("error", error);
    }
  };


  useEffect(() => {
    console.log("Updating chart data based on expenses:", expenses);
    if (expenses.length) {
      const data = expenses
        .map((expense) => ({
          date: new Date(expense.date),
          amount: expense.amount,
        }))
        .sort((a, b) => a.date - b.date)
        .map((exp) => ({
          ...exp,
          name: exp.date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));

      setChartData(data);
    }
  }, [expenses]);

  console.log("Chart Data:", chartData);

  const colors = ["#4f46e5", "#06b6d4", "#facc15", "#f472b6", "#10b981"];
  if (expenses.length === 0) {
  return (
    <>
      <div  className={`${
        theme === "dark" ? "text-white bg-black" : "text-[#B33791] hover:bg-gray-100"
      }`}><h1 className="text-2xl font-bold text-indigo-600 mb-4">Expenses Overview</h1>

      <FilterMenu onFilter={handleFilter} />

      <div className="w-full h-64 flex items-center justify-center bg-[#1f1f29] text-gray-300 rounded-lg mt-6">
        No Expenses Found
      </div></div>
    </>
  );
}


  return (
    <>
  {/* TITLE */}
  <h1 className="text-2xl font-bold text-indigo-600 mb-4">Expenses Overview</h1>

  <FilterMenu onFilter={handleFilter} />

  {/* ======================= AREA GRAPH ======================= */}
  <div
    className={`p-4 my-6 rounded-lg shadow-md ${
      theme === "dark"
        ? "text-white bg-black"
        : "text-[#B33791] bg-[#f0e0f0aa]"
    }`}
  >
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        key={refreshKey}
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.15} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="name"
          tick={{
            fill: theme === "dark" ? "#f3f4f6" : "#4b0082",
            fontSize: window.innerWidth < 640 ? 10 : 12,
          }}
        />
        <YAxis tick={{ fill: theme === "dark" ? "#f3f4f6" : "#4b0082" }} />

        <Tooltip
          contentStyle={{
            backgroundColor: "#2d2d2d",
            borderRadius: 8,
            border: "none",
          }}
          itemStyle={{ color: "#f3f4f6", fontWeight: "bold" }}
        />

        <Area
          type="monotone"
          dataKey="amount"
          stroke="#6366f1"
          fill="url(#colorAmount)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>

  {/* ======================= BAR GRAPH ======================= */}
  <h1 className="text-2xl font-bold text-indigo-400 mt-10 mb-4">
    Bar Graph
  </h1>

  <div
  className={`p-4 my-6 rounded-lg shadow-md ${
    theme === "dark"
      ? "text-white bg-black"
      : "text-[#B33791] bg-[#f0e0f0aa]"
  }`}
>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart key={refreshKey} data={chartData}>

      <XAxis
        dataKey="name"
        tick={{
          fill: theme === "dark" ? "#f3f4f6" : "#4b0082",  // FIXED
          fontSize: window.innerWidth < 640 ? 10 : 12,
        }}
      />

      <YAxis
        tick={{
          fill: theme === "dark" ? "#f3f4f6" : "#4b0082",  // FIXED
        }}
      />

      <Tooltip
        contentStyle={{
          backgroundColor: "#2d2d2d",
          borderRadius: 8,
          border: "none",
        }}
        itemStyle={{ color: "#f3f4f6", fontWeight: "bold" }}
      />

      <Legend />

      <Bar
        dataKey="amount"
        barSize={25}
        radius={[10, 10, 0, 0]}
        animationBegin={0}
        animationDuration={900}
        style={{ transition: "all 0.3s ease" }}
      >
        {chartData.map((entry, index) => (
          <Cell
            key={index}
            fill={colors[index % colors.length]}
            className="hover:opacity-60"
            style={{ transition: "0.2s ease" }}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

</>

  );
};
