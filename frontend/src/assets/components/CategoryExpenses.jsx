import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useUserContext } from "./Context/UserContext";

const VIBRANT_COLORS = [
  "#FF3F3F", "#FF9500", "#FFD700", "#00C851", "#33b5e5",
  "#9933FF", "#FF4081", "#FF6E40", "#00e676", "#2979FF",
];

const CategoryExpensePie = () => {
  const { userId } = useUserContext();
  const [data, setData] = useState([]);
  const [topCategory, setTopCategory] = useState(null);

  const fetchCategorySummary = async () => {
    try {
      const res = await axios.get(`https://financio-qskj.onrender.com/exp/category-summary/${userId}`);
      const sorted = res.data.sort((a, b) => b.totalAmount - a.totalAmount);
      setData(sorted);
      if (sorted.length > 0) setTopCategory(sorted[0]); // highest spending category
    } catch (err) {
      console.error("Error fetching category summary:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchCategorySummary();
  }, [userId]);

  return (
    <div className="w-full flex flex-col items-center">
      {topCategory && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-900 font-semibold shadow-md">
          Highest spending: <span className="font-bold">{topCategory.category}</span> – ₹{topCategory.totalAmount}
        </div>
      )}

      <PieChart width={350} height={350}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="totalAmount"
          nameKey="category"
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={VIBRANT_COLORS[index % VIBRANT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CategoryExpensePie;
