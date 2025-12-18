import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Label, Cell, Tooltip } from "recharts";
import { useUserContext } from "./Context/UserContext";

const DonutExpenseTable = ({ budgetType }) => {
  const { userId } = useUserContext();

  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

 const COLORS = [
  "#FF1744", // Spray Paint Red (bold + aggressive)
  "#00E676", // Neon Green (bright graffiti highlight)
  "#2979FF", // Electric Blue (street art base tone)
  "#FFEA00", // Sharp Neon Yellow (high contrast)
  "#D500F9", // Vivid Purple (graffiti tag color)
  "#FF6D00", // Burning Orange (urban glow)
];






  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://financio-qskj.onrender.com/exp/active-budget-expense", {
        params: { userId, budgetType },
      });
      const expenses = Array.isArray(res.data) ? res.data : [];
      console.log("Fetched expenses:--------", expenses);

      const categoryTotals = {};
      expenses.forEach((item) => {
        const amt = Number(item.amount) || 0;
        if (!categoryTotals[item.category]) categoryTotals[item.category] = 0;
        categoryTotals[item.category] += amt;
      });

      const pieFormat = Object.keys(categoryTotals).map((cat) => ({
        name: cat,
        uv: categoryTotals[cat],
      }));

      setChartData(pieFormat);
      setTableData(expenses);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchExpenses();
  }, [userId, budgetType]);

  const colorMap = {};
chartData.forEach((item, index) => {
  colorMap[item.name] = COLORS[index % COLORS.length];
});

console.log("chartData:", chartData);

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="p-4 rounded-xl w-full ">
      <h2 className="text-3xl font-bold mb-4 text-white flex items-center justify-center">Daily Expense Breakdown</h2>

      {/* Donut Chart */}
     <div className="flex justify-center">
  {chartData.length === 0 ? (
    <div className="flex items-center justify-center w-[300px] h-[260px]">
      <p className="text-[#dcd9d9be] text-xl font-semibold">No spending today yet</p>
    </div>
  ) : (
    <PieChart width={300} height={260}>
      <Pie
        data={chartData}
        dataKey="uv"
        nameKey="name"
        outerRadius={100}
        innerRadius={55}
        cornerRadius={12}
        paddingAngle={3}
      >
        {chartData.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}

        <Label
          position="center"
          fontSize={14}
          fontWeight="bold"
          fill="white"
        >
          Expenses
        </Label>
      </Pie>

      <Tooltip
        formatter={(value, name) => [`₹${value}`, name]}
        contentStyle={{
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "10px",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        itemStyle={{ color: "#333" }}
      />
    </PieChart>
  )}
</div>


      {/* Table */}
      <div className="mt-6 max-h-64 overflow-y-auto border rounded-lg w-full">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#2101147d] sticky top-0 font-Hubot">
            <tr>
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((e, index) => (
              <tr key={index} className="border-b hover:bg-[#e2cae08f]">
                <td className="p-2" style={{ color: colorMap[e.category] }}>
  {e.item}
</td>
                <td className="p-2 text-green-500">₹{e.amount}</td>
                <td className="p-2">
  {new Date(e.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonutExpenseTable;
