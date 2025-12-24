import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import earning from "../../assets/earning.png";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { HiMenuAlt3 } from "react-icons/hi";

import { useTheme } from "./Context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import { useUserContext } from "./Context/UserContext";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { userId } = useUserContext();
  const navigate = useNavigate();

  const [IsLoggedIn, setIsloggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showsignup, setShowsignup] = useState(false);

  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");

  // --------------------------------------------------
  // Fetch user data
  // --------------------------------------------------
  const fetchUserData = async () => {
    try {
      if (!userId) return;

      const res = await axios.get(
         `https://financio-qskj.onrender.com/auth/me?userId=${userId}`
      );

      setUsername(res.data.name);
      setUserImage(res.data.profilePic);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    setIsloggedIn(!!token);
  }, []);

  // --------------------------------------------------
  // Navigation helpers
  // --------------------------------------------------
  const goDashboard = () => {
    if (!IsLoggedIn) {
      toast.warning("Please login first!");
      return;
    }
    navigate("/dashboard/userprofile");
  };

  const logout = () => {
    localStorage.clear();
    setIsloggedIn(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <>
      {/* NAVBAR */}
      <div
        className={`w-full px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50 ${
          theme === "dark"
            ? "bg-[#0b011d] text-white"
            : "bg-white text-[#B33791]"
        }`}
      >
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src={earning} alt="logo" className="w-8 h-8" />
          <span className="font-bold text-lg hidden sm:block">FinanCio</span>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-10 font-medium">
          <li onClick={goDashboard} className="cursor-pointer">
            Dashboard
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li
            onClick={() => navigate("/contact")}
            className="cursor-pointer"
          >
            Contact
          </li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button onClick={toggleTheme}>
            {theme === "light" ? (
              <MdDarkMode size={26} />
            ) : (
              <CiLight size={26} />
            )}
          </button>

          {/* AUTH / PROFILE */}
          {IsLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar className="w-9 h-9">
                    {userImage ? (
                      <AvatarImage src={userImage} />
                    ) : (
                      <AvatarFallback className="bg-[#B33791] text-white">
                        {username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  Hi, {username || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={goDashboard}>
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/dashboard/profile")}
                >
                  Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <button
                className="bg-[#B33791] px-4 py-2 rounded-xl text-white text-sm"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>

              <button
                className="bg-[#B33791] px-4 py-2 rounded-xl text-white text-sm"
                onClick={() => setShowsignup(true)}
              >
                Signup
              </button>
            </>
          )}

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <HiMenuAlt3 size={26} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={goDashboard}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/")}>
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/contact")}>
                  Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setIsloggedIn(true);
            setShowLogin(false);
            fetchUserData();
          }}
        />
      )}

      {showsignup && (
        <Signup onClose={() => setShowsignup(false)} />
      )}
    </>
  );
};
