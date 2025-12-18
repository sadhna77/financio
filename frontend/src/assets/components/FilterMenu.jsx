import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "./Context/ThemeContext";


const today = new Date();

const getDateRange = (type) => {
  const today = new Date();
  let start, end;

  switch (type) {
    case "week":
      start = new Date();
      start.setDate(today.getDate() - 7);
      end = today;
      break;

    case "month":
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 1);
      break;

    case "year":
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear(), 0, 1);
      break;

    default:
      start = today;
      end = today;
  }

  return { startDate: start, endDate: end };
};

export default function FilterMenu({ onFilter }) {
  const [selected, setSelected] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
    const { theme } = useTheme();
  

  const handleSelect = (value) => {
    setSelected(value);

    if (value === "custom") return;

    const range = getDateRange(value);
    onFilter(range, value);
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    const range = {
      startDate: new Date(customStart),
      endDate: new Date(customEnd),
    };
    onFilter(range, "custom");
  };

  return (
    <div className="space-y-4 my-4">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="year">Last Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {selected === "custom" && (
        <div className="flex gap-2 items-center">

               <Input
                      type="date"
           value={customStart} onChange={(e) => setCustomStart(e.target.value)}
                className={`appearance-none px-3 py-2 rounded 
              ${theme === "dark" 
                ? "bg-black text-white placeholder-gray-200 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-datetime-edit-fields-wrapper]:text-gray-400"
                : "bg-white text-black placeholder-gray-500"
              }`}/>
               <Input
                      type="date"
           value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
                className={`appearance-none px-3 py-2 rounded 
              ${theme === "dark" 
                ? "bg-black text-white placeholder-gray-200 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-datetime-edit-fields-wrapper]:text-gray-400"
                : "bg-white text-black placeholder-gray-500"
              }`}/>
          
          <Button onClick={handleApplyCustom}>Apply</Button>
        </div>
      )}
    </div>
  );
}
