import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import earning from "../../assets/earning.png";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { useTheme } from "./Context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import { useUserContext } from "./Context/UserContext";


export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const { userId } = useUserContext();   // ✅ you already use this
  const navigate = useNavigate();

  const [IsLoggedIn, setIsloggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showsignup, setShowsignup] = useState(false);

  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");


  // ----------------------------------------------------------
  // ✅ Fetch profile data (image + name)
  // ----------------------------------------------------------
  const fetchUserData = async () => {
    try {
      if (!userId) return;

      const res = await axios.get(
        `http://localhost:3000/auth/me?userId=${userId}`
      );

      setUsername(res.data.name);
      setUserImage(res.data.profilePic);

      localStorage.setItem("userImage", res.data.profilePic);

    } catch (err) {
      console.log(err);
    }
  };


  // ----------------------------------------------------------
  // ✅ Fetch when userId changes
  // ----------------------------------------------------------
  useEffect(() => {
    fetchUserData();
  }, [userId]);


  // ----------------------------------------------------------
  // ✅ Check login
  // ----------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    if (token) {
      setIsloggedIn(true);
      fetchUserData();
    } else {
      setIsloggedIn(false);
    }
  }, []);


  // ----------------------------------------------------------
  // ✅ Dashboard navigation
  // ----------------------------------------------------------
  const handleGoDashboard = () => {
    if (!IsLoggedIn) {
      toast.warning("Please login first!");
      return;
    }
    navigate("/dashboard/userprofile");
  };


  // ----------------------------------------------------------
  // ✅ Render profile avatar
  // ----------------------------------------------------------
  const renderAvatar = () => (
    <Avatar className="w-10 h-10">

      {userImage ? (
        <AvatarImage src={userImage} alt={username} />
      ) : (
        <AvatarFallback className="bg-[#B33791] text-white font-semibold">
          {username ? username.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      )}

    </Avatar>
  );


  return (
    <div
      className={`w-full px-6 py-4 flex justify-between items-center shadow-2xs ${
        theme === "dark"
          ? "text-white bg-[#0b011d]"
          : "text-[#B33791] hover:bg-gray-100"
      }`}
    >

      {/* LOGO */}
      <img src={earning} alt="logo" className="w-8 h-8" />


      {/* MENU */}
      <ul className="hidden md:flex gap-10">

        <li onClick={handleGoDashboard} className="cursor-pointer">
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

        {/* ✅ Logged in avatar */}
        {IsLoggedIn && renderAvatar()}


        {/* ✅ Login / Signup */}
        {!IsLoggedIn && (
          <>
            <div className="flex gap-2">
              <button
                className="bg-[#B33791] p-2 rounded-2xl text-white"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>

              <button
                className="bg-[#B33791] p-2 rounded-2xl text-white"
                onClick={() => setShowsignup(true)}
              >
                Signup
              </button>
            </div>

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
        )}


        {/* THEME BUTTON */}
        <button onClick={toggleTheme}>
          {theme === "light" ? (
            <MdDarkMode size={30} className="cursor-pointer" />
          ) : (
            <CiLight size={30} className="cursor-pointer" />
          )}
        </button>

      </div>

    </div>
  );
};
