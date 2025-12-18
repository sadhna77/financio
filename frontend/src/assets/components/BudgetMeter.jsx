





import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { useUserContext } from "./Context/UserContext";

const BudgetMeter = ({ theme }) => {
  const { userId } = useUserContext();
  const [percentage, setPercentage] = useState(0);
  const [status, setStatus] = useState("safe");
  const [todaySpent, setTodaySpent] = useState(0);

  // Fetch daily spending data
  const fetchDailyBudget = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://financio-qskj.onrender.com/exp/daily-check/${userId}`
      );

      const { todaySpent, avgDailyLimit, status } = res.data;
      setTodaySpent(todaySpent);

      const percent =
        avgDailyLimit > 0 ? (todaySpent / avgDailyLimit) * 100 : 0;

      setPercentage(Math.min(percent, 150));
      setStatus(status);
    } catch (err) {
      console.error("Error fetching daily budget:", err);
    }
  };

  useEffect(() => {
    fetchDailyBudget();
  }, [userId]);

  // Meter zone colors
  const getZoneColor = () => {
    if (percentage <= 75) return "#51cf66"; // safe
    if (percentage <= 100) return "#ffd43b"; // critical
    return "red"; // danger
  };

  // ApexChart options
  const chartOptions = {
    chart: {
      type: "radialBar",
      offsetY: -20,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "60%" },
        track: { background: "#eee", strokeWidth: "100%" },
        dataLabels: {
          name: {
            show: true,
            fontSize: "16px",
            offsetY: 30,
            text: "Today",
            color: theme === "dark" ? "#fff" : "#2f012d",
          },
          value: {
            show: true,
            fontSize: "24px",
            fontWeight: "bold",
            offsetY: 0,
            formatter: (val) => `${Math.round(val)}%`,
            color: getZoneColor(),
          },
        },
      },
    },
    fill: { colors: [getZoneColor()] },
    stroke: { lineCap: "round" },
    labels: ["Spent"],
  };

  // SAVING DATA
  const [todaySaved, setTodaySaved] = useState(0);
  const [savePercent, setSavePercent] = useState(0);

  const fetchSavingData = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://financio-qskj.onrender.com/exp/today-saving/${userId}`
      );

      const { avgDailyLimit, todaySpent, todaySaved } = res.data;

      setTodaySaved(todaySaved);

      const percent =
        avgDailyLimit > 0 ? (todaySaved / avgDailyLimit) * 100 : 0;

      setSavePercent(Math.min(percent, 100));
    } catch (err) {
      console.log("Saving data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSavingData();
  }, [userId]);

  // Saving Bar Color Logic
  const getSavingColor = () => {
    if (savePercent < 40 ) return "bg-green-500"; // safe
    if (savePercent < 80) return "bg-yellow-400"; // critical
    return "bg-red-500"; // danger
  };

  return (
    <div className="p-4 bg-[#14011a2b] rounded-xl w-full max-w-md mx-auto text-white">
      <h2 className="text-center font-bold text-3xl mb-4">Daily Budget Meter</h2>

      {/* Radial Meter */}
      <ReactApexChart
        options={chartOptions}
        series={[percentage]}
        type="radialBar"
        height={350}
      />

      {/* Zones */}
      <div className="mt-4 flex justify-around text-sm font-medium">
        <div className="text-green-600">Safe Zone</div>
        <div className="text-yellow-500">Critical Zone</div>
        <div className="text-red-500">Danger Zone</div>
      </div>

      {/* Spend Details */}
      <div className="mt-3 text-center">
        <p>
          Today Spent:{" "}
          <span className="text-green-500 font-bold">₹{todaySpent}</span>
        </p>
        <p>
          Budget Status:{" "}
          <span
            className={`font-bold ${
              status === "high"
                ? "text-red-500"
                : status === "low"
                ? "text-green-600"
                : "text-yellow-500"
            }`}
          >
            {status}
          </span>
        </p>
      </div>

      {/* Saving Card */}
      <div className="mt-6 p-4 bg-[#14011a5a] rounded-xl">
        <h3 className="text-xl font-semibold mb-2 text-center">
          Today's Saving
        </h3>

        {/* CUSTOM Progress Bar */}
        <div className="w-full h-3 bg-[#35003a] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getSavingColor()}`}
            style={{ width: `${savePercent}%` }}
          ></div>
        </div>

        <p className="text-center mt-2 text-lg">
          Saved:{" "}
          <span className="text-green-400 font-bold">₹{todaySaved}</span>
        </p>

        <p className="text-center text-sm text-gray-300">
          {Math.round(savePercent)}% of daily budget saved
        </p>
      </div>
    </div>
  );
};

export default BudgetMeter;
