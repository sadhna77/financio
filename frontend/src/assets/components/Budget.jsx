import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";











export const Budget = () => {
  

  const [userId, setUserId] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const getdata = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/income", {
        params: { userId },
      });
      console.log("income",res.data);

        if (res.data && res.data.length > 0) {
              const formatted = res.data.map((item) => ({
                name: item.name, // or item.date if available
                totalIncome: item.totalIncome,
              }));
              setIncomeData(formatted);
              console.log("income",incomeData)
            } else {
              console.log("No data found");
            }

      console.log("income",res.data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
  const token = localStorage.getItem("authtoken");
  if (token) {
    const decoded = jwtDecode(token);
    setUserId(decoded.userId);
  }
}, []);

// call getdata once userId is available
useEffect(() => {
  if (userId) {
    getdata();
  }
}, [userId]);

  
  
  return (
    <>
     <div className="p-4 ">
     <button onClick={getdata}>Click to Fetch Income Data</button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={incomeData}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalIncome" stroke="#B33791" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  

    </>
  );
};
