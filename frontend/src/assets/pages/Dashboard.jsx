import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Menu, Home, Inbox, Calendar, Search, Settings, LogOut } from "lucide-react";
import { MdDashboard } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import moneybag from "../../assets/moneybag.png";
import { VscGraph } from "react-icons/vsc";
import { GiReceiveMoney } from "react-icons/gi";
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import path from "path";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Context/ThemeContext";
import { useUserContext } from "../components/Context/UserContext";
import axios from "axios";
import { useEffect } from "react";



export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
    const { userId, setExpenses, expenses } = useUserContext();
  const [income, setIncome] = useState({
    salary: "",
    bonus: "",
    sideIncome: "",
  });
  const [incomeExist, setIncomeExist] = useState(false);
  
  

  const LogOut = () => {
    // Yahan logout logic likho localStorage se token hatana
   
  localStorage.removeItem("authtoken");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("email");

  // Reset Context/State if you use any
  // setUser(null);  // optional
  // setBudgetInfo([]); // optional

  navigate('/');
  window.location.reload(); // force fresh state
   
  };









   //  this is for fetching income 
  const fetchIncome = async () => {
    if (!userId) return; // Don't fetch if no userId
    try {
      const res = await axios.get("https://financio-qskj.onrender.com/api/income", {
        params: { userId },
      });
      console.log("income data fetched:", res.data);
      const incomeData = res.data[0] || {};
      setIncome({
        salary: incomeData.salary || "",
        bonus: incomeData.bonus || "",
        sideIncome: incomeData.sideIncome || "",
      });

      if ((res.data.length = !0)) {
        setIncomeExist(true);
      }
    } catch (error) {
      console.log("Error fetching income:", error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [userId]);

  

  const menuItems = [
    {
      icon: <GiMoneyStack color="#B33791" size={30} />,
      label: "Income",
      path: "/dashboard/income",
    },
    { icon: <GiReceiveMoney color="#B33791" size={30} />, label: "Budget", path: "/dashboard/budget", },
    { icon: <VscGraph color="#B33791" size={30} />, label: "Visuals", path: "/dashboard/plot", },
    { icon: <GiPayMoney color="#B33791" size={30} />, label: "Save", path: "/dashboard/savings", },
    { icon: <Settings color="#B33791" size={30} />, label: "Settings",  path: "/dashboard/setting",},
  ];

  return (


<div className={`${
          theme === "dark"
            ? "text-[#B33791] bg-black"
            : "bg-gradient-to-r"
        }`}>
    <div className={`h-screen flex flex-col font-Hubot `}>
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`border-r h-full transition-all duration-300  ${
          theme === "dark"
            ? "text-[#B33791] bg-black"
            : "text-[#B33791]-60 bg-[#B33791]-100"
        }
            ${isOpen ? "w-64" : "w-16"} 
            hidden sm:flex flex-col items-center sm:items-start p-2`}
            
        >
          {/* Toggle Button */}
          <button
            className="self-end mb-4 text-[#B33791]-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MdDashboard
              size={30}
              className={`mr-4 transition-all duration-300 hover:text-black ${
                isOpen ? "rotate-12 scale-110 text-[#B33791]-600" : "text-[#B33791]-500"
              }`}
            />
          </button>

          {/* Menu List + Spacer + Logout */}
          <div className={`flex flex-col justify-between h-full w-full overflow-y-auto ${
          theme === "dark"
            ? "text-[#B33791] bg-black"
            : "text-[#B33791]-600 hover:bg-[#B33791]-100"
        }`}>
            <div className="space-y-2">
              {menuItems.map((item, idx) => (
                <Link to={item.path} key={idx} className="block">
                  <div className="flex items-center space-x-2 w-full px-2 py-2 hover:bg-[#8b7a87ab] rounded">
                    {item.icon}
                    {isOpen && <span className={`text-sm ${
          theme === "dark"
            ? "text-white  "
            : "text-[#B33791]  "
        }  `}>{item.label}</span>}
                  </div>
                </Link>
              ))}
            </div>

            {/* Logout Button at Bottom */}
            <div className="flex items-center px-2 py-3 hover:bg-[#8b7a87ab] rounded cursor-pointer">
              <BiLogOutCircle
                color="#B33791"
                size={30}
                className="-rotate-90 inline mr-2"
                onClick={LogOut}
              />
              {isOpen && <span className="text-sm text-white hover:bg-[#8b7a87ab]">Logout</span>}
            </div>
          </div>
        </aside>

{/* Mobile Sidebar (Visible only on smaller screens) */}
<div
  className={`sm:hidden bg-[#B33791]-100 p-2 space-y-4 transition-all duration-300 ${
    isOpen ? "w-1/3" : "w-12"
  }`}
>
  {/* Toggle Button */}
  <button
    className="mb-4 ml-auto text-white hover:"
    onClick={() => setIsOpen(!isOpen)}
  >
    <MdDashboard
      size={26}
      className={`transition-all duration-300 hover:text-black ${
        isOpen ? "rotate-12 scale-110 text-[#B33791]-600" : "text-[#B33791]-500"
      }`}
    />
  </button>

  {/* Menu Items */}
  <div className="flex flex-col items-start space-y-3">
    {menuItems.map((item, idx) => (
      <Link to={item.path} key={idx} className="w-full">
        <div className="flex items-center space-x-2 px-2 py-2 hover:bg-[#B33791] rounded w-full">
          {/* Keep original icon size (like 30) */}
          {item.icon}
          {isOpen && (
            <span className="text-sm font-medium">{item.label}</span>
          )}
        </div>
      </Link>
    ))}
  </div>

  {/* Logout Button at Bottom */}
  <div className="mt-auto flex items-center justify-start hover:bg-[#B33791] rounded cursor-pointer px-2 py-2">
    <BiLogOutCircle
      color="#B33791"
      className={`-rotate-90 transition-all duration-300 ${
        isOpen ? "text-[30px] mr-2" : "text-[36px]"
      }`}
    />
    {isOpen && <span className="text-sm font-bold text-white hover:bg-[#8b7a87ab]">Logout</span>}
  </div>
</div>







        {/* Main Content */}
        <main className="flex-1 overflow-y-auto  relative p-6">
          {/* Route content */}
          <Outlet />
     
              
      


        </main>
      </div>
    </div>


  
    </div>
  );
};
