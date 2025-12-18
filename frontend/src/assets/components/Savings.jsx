import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IoMdTrendingUp } from "react-icons/io";
import { IoMdTrendingDown } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { LuScanText } from "react-icons/lu";
import { PiSpinnerGap } from "react-icons/pi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";



import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FilterMenu from "./FilterMenu";
import OCRScanner from "./aiSmart";
import { useTheme } from "../components/Context/ThemeContext";

export const Savings = () => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("others");
  const [item, setItem] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [date, setDate] = useState("");
  const [increasing, setIncreasing] = useState(false);
  const [type, setType] = useState("");
  const [filterDates, setFilterDates] = useState(null); // to store active filter date range
  const [showScanner, setShowScanner] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const[Loading,setLoading]=useState(false)

  // for colors
  const stringToHSL = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 100%, 50%)`; // vibrant colors
  };

  /* ------------------------------------------------
    🎨 Soft Vibrant HSL Color Generator
  --------------------------------------------------- */
  const stringToHSL2 = (str) => {
    if (!str) return "hsl(200, 20%, 70%)";

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 78%)`; // soft pastel shades
  };

  const CategoryBadge = ({ category }) => {
    const bgColor = stringToHSL(category);

    return (
      <Badge
        variant="outline"
        style={{
          backgroundColor: bgColor,
          color: "black",
          borderColor: "#ccc",
          fontSize: "0.875rem",
          padding: "3px 6px",
          borderRadius: "8px",
          fontWeight: "500",
        }}
      >
        {category}
      </Badge>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    }
  }, []);
  

  const handleAddExpense = async () => {
    const token = localStorage.getItem("authtoken");
    if (!amount || !category || !date) {
      alert("Please fill all fields before adding an expense");
      return;
    }

    try {
      await axios.post(
        "https://financio-qskj.onrender.com/exp/expense",
        {
          userId,
          amount,
          category,
          item,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (type && filterDates) {
        handleFilter(filterDates, type);
      } else {
        fetchExpenses(); // refresh list
      }
       
      setAmount("");
      setCategory("");
      setDate("");
      setItem("");
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  function convertToInputDateFormat(dateString) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const handleScannedData = (data) => {
    console.log("child to parent", data);

    setAmount(data.amount);
    setCategory(data.product);
    const formatDate = convertToInputDateFormat(data.date);
    setDate(formatDate);

    setShowScanner(false);
  };

  const fetchExpenses = async () => {
    try {

      setLoading(true)
      const res = await axios.get("https://financio-qskj.onrender.com/exp/expense", {
        params: { userId },
      });
      console.log("Fetched Expenses:", res.data);
      setLoading(false);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  const handleFilter = async ({ startDate, endDate }, type) => {
    setType(type);
    setFilterDates({ startDate, endDate });

    console.log(startDate.toISOString());
    try {
      const res = await axios.get("https://financio-qskj.onrender.com/exp/filteredexpense", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userId,
          type,
        },
      });
      const { expenses, totalSpent, week, month, year, custom } = res.data;
      console.log("data backend se ", res.data);

      if (
        (type === "week" && week) ||
        (type === "month" && month) ||
        (type === "year" && year) ||
        (type === "custom" && custom)
      ) {
        setIncreasing(true);
      } else {
        setIncreasing(false);
      }

      setExpenses(expenses);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (userId) fetchExpenses();
  }, [userId]);

  const [budgetType, setBudgetType] = useState("monthly");
  const [budgetamount, setBudgetamount] = useState("");
  const [Budgetdate, setBudgetdate] = useState();
  // const [Savingamount, setSavingAmount] = useState();
  const handleBudgetPlan = async () => {
    try {
      const res = await axios.post("https://financio-qskj.onrender.com/exp/Budgetplan", {
        userId,
        budgetType,
        Budgetdate,
        budgetamount,
      });

      console.log(" budget planning",res.data);
    } catch (error) {
      console.log("some error in budget planning", error);
    }
  };

  // delete the expense
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("authtoken");
      await axios.delete(`https://financio-qskj.onrender.com/exp/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the list after delete
      if (type && filterDates) {
        handleFilter(filterDates, type);
      } else {
        fetchExpenses(); // refresh list
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };







  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 ">Expense Tracker</h2>

      <div className="flex gap-2 mb-4  ">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        
        />

       <div className="flex flex-col gap-2">
  
 <div className="flex flex-col w-40">

  {/* Dropdown */}
  <Select value={category} onValueChange={setCategory} className="w-full text-gray-500">
    <SelectTrigger className="h-10 w-full">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Others">Others</SelectItem>
      <SelectItem value="Food">Food</SelectItem>
      <SelectItem value="Travel">Travel</SelectItem>
      <SelectItem value="Shopping">Shopping</SelectItem>
      <SelectItem value="Bills">Bills</SelectItem>
      <SelectItem value="Entertainment">Entertainment</SelectItem>
      <SelectItem value="Health">Health</SelectItem>
      <SelectItem value="Recharge">Recharge</SelectItem>
      <SelectItem value="Education">Education</SelectItem>
      <SelectItem value="DailySpending">Daily spendings</SelectItem>
    </SelectContent>
  </Select>

  {/* Input always visible */}
  {/* <Input
    className="h-10 mt-1"
    placeholder="Custom category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  /> */}
</div>


</div>

        <Input
          placeholder="item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
         
         
        <Input
            type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
      className={`appearance-none px-3 py-2 rounded 
    ${theme === "dark" 
      ? "bg-black text-white placeholder-gray-200 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-datetime-edit-fields-wrapper]:text-gray-400"
      : "bg-white text-black placeholder-gray-500"
    }`}
  
         
          
        />

        <Button onClick={handleAddExpense}>Add</Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowScanner(true)}
                className="p-2 bg-[#51083f] text-white rounded"
              >
                <LuScanText />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Scan receipt</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 👇 Modal */}
        {showScanner && (
          <div className="fixed transition-all inset-0 bg-opacity-50 flex justify-end h-34 mt-48  mr-8 z-50">
            <div className="w-40 bg-[#490437] rounded-2xl text-white text-sm">
              <button
                onClick={() => setShowScanner(false)}
                className="absolute top-2 right-3 text-white text-lg"
              >
                ✖
              </button>
              <OCRScanner ScannedData={handleScannedData} />
            </div>
          </div>
        )}
      </div>



    

      {/* for budget planning  */}
      {/* <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Your Budget Planning
      </h2>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
     
        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-50"
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
          placeholder="Select date"
          value={Budgetdate}
          type="date"
          onChange={(e) => setBudgetdate(e.target.value)}
        />

      
        <Button onClick={handleBudgetPlan}>Plan</Button>
      </div> */}
















      <div>
        <FilterMenu onFilter={handleFilter} />
      </div>
      


      {Loading ? (
  <PiSpinnerGap size={30} color="blue" />
) : (
  <>
    {/* Beautiful heading ABOVE the table */}
    <div
      className={`w-full text-center py-3 text-lg font-semibold rounded-md border mb-2
        ${
          theme === "dark"
            ? "bg-[#1b011b] text-[#d4d4d4] border-[#3a0530]"
            : "bg-white text-black border-gray-200"
        }`}
    >
      Table of Expenses
    </div>

    <Table className="font-winky">
      <TableCaption>A list of Expenses, Bills.</TableCaption>

      <TableHeader>
        <TableRow className="bg-purple-200 dark:bg-gray-800">
          <TableHead className="w-[80px]">S No.</TableHead>
          <TableHead className="w-[150px]">Date</TableHead>
          <TableHead className="w-[150px]">Item</TableHead>
          <TableHead className="w-[150px]">Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Options</TableHead>
          <TableHead className="text-right">Options</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {expenses.map((exp, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>

            <TableCell className="font-medium">
              {new Date(exp.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </TableCell>

            {/* ITEM Gradient Badge */}
            <TableCell>
              <span
                className="px-3 py-1 text-xs font-semibold rounded-lg border shadow-sm"
                style={{
                  background: `linear-gradient(135deg,
                    ${stringToHSL2(exp?.item)},
                    ${stringToHSL2(exp?.item + "x")}
                  )`,
                  color: theme === "dark" ? "black" : "#1b011b",
                  borderColor: "rgba(0,0,0,0.1)",
                }}
              >
                {exp?.item || "Unknown"}
              </span>
            </TableCell>

            <TableCell>
              <CategoryBadge category={exp.category} />
            </TableCell>

            <TableCell className="text-right text-green-400">₹{exp.amount}</TableCell>

            <TableCell className="text-right">
              {type &&
                (increasing ? (
                  <IoMdTrendingUp color="red" size={20} />
                ) : (
                  <IoMdTrendingDown color="green" size={20} />
                ))}
            </TableCell>

            <TableCell className="flex items-center gap-4">
              <FiEdit
                size={18}
                className="text-gray-500 hover:text-blue-600 cursor-pointer transition duration-200"
              />
              <MdDeleteForever
                size={20}
                className="text-red-500 hover:text-red-700 cursor-pointer transition duration-200"
                onClick={() => deleteExpense(exp._id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
)}

      
      
    </div>
  );
};
