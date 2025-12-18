"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp,TrendingDown } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useUserContext } from "./Context/UserContext";
import { useTheme } from "./Context/ThemeContext";
import CategoryExpensePie from "./CategoryExpenses";

const chartConfig = {
  expected: { label: "Expected", color: "var(--chart-1)" },
  actual: { label: "Actual", color: "var(--chart-2)" },
};

export default function TrendGraph() {
  const [trend, setTrend] = useState([]);
  const [budgetType, setBudgetType] = useState("");
  const { userId } = useUserContext();
  const { theme } = useTheme();
  // const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [datastatus, setDatastatus] = useState("");

  const fetchTrendData = async () => {
    try {
      const res = await axios.get(
        `https://financio-qskj.onrender.com/exp/budget-trend/${userId}`
      );
      console.log("Trend data:", res.data);
      setTrend(res.data.trend);
      setBudgetType(res.data.budgetType);
    } catch (err) {
      console.log("Trend fetch error:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchTrendData();
  }, [userId]);

  const fetchDailyCheck = async () => {
    try {
      const res = await axios.get(
        `https://financio-qskj.onrender.com/exp/daily-check/${userId}`
      );
      setDatastatus(res.data.status);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyCheck();
  }, [userId]);

  // Theme-based colors
  const gridStroke = theme === "dark" ? "#444" : "#e5e5e5";
  const axisStroke = theme === "dark" ? "#aaa" : "#333";
  const cardBg = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  return (
    <div className="flex flex-row"><Card className={`w-1/2 ${cardBg} border border-[#938c91]/40 shadow-md backdrop-blur-sm m-2`}>
      <CardHeader>
        <CardTitle className="text-[#d1119e]">
          Spending Trend ({budgetType})
        </CardTitle>
        <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Expected vs Actual daily usage
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={trend} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} stroke={gridStroke} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}}
              stroke={axisStroke}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* Expected Line (dotted) */}
            <Line
              dataKey="expected"
              type="monotone"
              stroke="red"      
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />

            {/* Actual Line (solid) */}
            <Line
              dataKey="actual"
              type="monotone"
              stroke="green"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trend analysis according to today’s spendings {datastatus === "high" ? (
  <TrendingUp className="h-4 w-4 text-red-500" />
) : (
  <TrendingDown className="h-4 w-4 text-green-500" />
)}

        </div>
        <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Showing real spending pattern based on active budget
        </div>
      </CardFooter>
    </Card>
    {/* ----------------------------------------------------------- */}
    <Card className={`w-1/2 ${cardBg} border border-[#938c91]/40 shadow-md backdrop-blur-sm m-2`}>
      <CardHeader>
       
       <CardDescription
  className={`text-sm md:text-base font-semibold mb-2 ${
    theme === "dark" ? "text-[#d1119e]" : "text-gray-600"
  }`}
>
  Category-wise expense distribution
</CardDescription>

      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
              <CategoryExpensePie/>

        </ChartContainer>
      </CardContent>


    </Card>
    </div>
  );
}


