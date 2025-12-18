import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "./Context/UserContext";

const TotalSalary = ({income}) => {
  const { userId } = useUserContext();

  const [todaySpend, setTodaySpend] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/exp/daily-check/${userId}`
      );

      // Backend returns: todaySpent
      setTodaySpend(res.data.todaySpent || 0);

    } catch (err) {
      console.error("Error fetching today spend:", err);
      setTodaySpend(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-gray-400">
        Loading your financial summary...
      </div>
    );
  }

  return (
    <div className="
      w-full p-4 mt-3 rounded-xl 
      border border-[#938c91]/40 
      bg-white/5 dark:bg-black/40 
      shadow-md backdrop-blur-sm
      flex items-center justify-between
    ">

      {/* Total Income */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-300">Total Income</span>
        <h2 className="text-2xl font-semibold text-green-800">
          ₹{income}
        </h2>
      </div>

      {/* Today's Spend */}
      <div className="flex flex-col text-right">
        <span className="text-sm text-gray-300">Today’s Spend</span>
        <h2 className="text-2xl font-semibold text-red-800">
          ₹{todaySpend}
        </h2>
      </div>

    </div>
  );
};

export default TotalSalary;
