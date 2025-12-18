import React from "react";
import FinancialPlanning from "../../assets/FinancialPlanning.PNG";
import image1 from "../../assets/fino.png";
import Budgetblock from "../../assets/Budgetblock.jpg";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.jpg";
import image4 from "../../assets/image1.png";
import earning from "../../assets/earning.png";
import { ArrowRight } from "lucide-react"; // Optional: Install `lucide-react` or use any icon
import { useState } from "react";
import Signup from "../components/Signup";
import { useTheme } from "../components/Context/ThemeContext";
import { Navbar } from "../components/Navbar";


export const HeroSection = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
    const { theme, toggleTheme } = useTheme();
  

  return (



    <div className={`w-screen min-h-screen flex flex-col  font-space ${
          theme === "dark"
            ? "text-white bg-black"
            :  "bg-gradient-to-r from-blue-50 to-green-50"
        } `}>
      {/* Top Navigation Bar */}
      <div className="w-full flex flex-wrap md:flex-nowrap justify-between items-center shadow-md bg-white z-30 sticky top-0 ">
        {/* Logo / Icon
        <div className="text-xl font-bold text-[#C562AF] flex items-center gap-2">
          <img src={earning} alt="logo" className="w-8 h-8 object-contain" />
          <span className="hidden sm:inline">FinanCio</span>
        </div> */}

        {/* Navigation Links */}
        {/* <div className="flex gap-4 sm:gap-6 text-gray-700 font-medium text-sm sm:text-base mt-2 md:mt-0">
          <a href="#support" className="hover:text-[#B33791]  transition">
            Support
          </a>
          <a href="#how" className="hover:text-[#B33791]  transition">
            How it Works
          </a>
          <a href="#contact" className="hover:text-[#B33791]  transition">
            Contact
          </a>
        </div> */}
        <Navbar/>
      </div>




      

      {/* Hero Content */}
      {/* FULL LONG HERO EXPERIENCE */}
<div
  className={`w-full min-h-screen overflow-x-hidden transition-colors duration-500 ${
    theme === "dark" ? "bg-black text-white" : "bg-gradient-to-b from-blue-50 to-white"
  }`}
>
  
  {/* SECTION 1 — MAIN HERO */}
  {/* SECTION 1 — NEW PREMIUM HERO WITH OVERLAY */}
<section
  className="relative w-full h-[90vh] overflow-hidden rounded-b-[50px]"
>
  {/* Background Image */}
  <img
    src={Budgetblock} // yaha apni image daalna chaaho to FinancialPlanning bhi daal sakte ho
    alt="Budget Planning"
    className="absolute w-full h-full object-cover"
  />

  {/* Dark Overlay for better text readability */}
  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

  {/* Text Content */}
  <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 max-w-3xl">
    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
      Take Control of Your
      <span className="block mt-2 bg-gradient-to-r from-[#B33791] to-blue-400 text-transparent bg-clip-text">
        Financial Life
      </span>
    </h1>

    <p className="text-lg md:text-xl text-gray-200 opacity-90 mt-6">
      Track expenses, set budgets, scan bills, and manage money smartly —
      FinanCio is your personal financial assistant.
    </p>

    <button
      onClick={() => setShowSignup(true)}
      className="mt-8 w-fit px-8 py-4 bg-[#B33791] hover:bg-[#C562AF] text-white text-lg rounded-2xl shadow-xl flex items-center gap-2"
    >
      Get Started
      <ArrowRight size={22} />
    </button>
  </div>
</section>


  {/* SECTION 2 — GLASSY FEATURE CARDS */}
  <section className="py-20 px-6 bg-transparent">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-[#B33791] to-blue-400 bg-clip-text text-transparent">
        What Makes FinanCio Special?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        
        <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 p-8 rounded-3xl shadow-lg border border-white/30">
          <h3 className="text-2xl font-bold">Daily Expense Tracking</h3>
          <p className="opacity-80 mt-3">
            Log spending in seconds. Stay always updated.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 p-8 rounded-3xl shadow-lg border border-white/30">
          <h3 className="text-2xl font-bold">Smart Budget Alerts</h3>
          <p className="opacity-80 mt-3">
            Get notified when spending goes beyond your limits.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 p-8 rounded-3xl shadow-lg border border-white/30">
          <h3 className="text-2xl font-bold">Beautiful Insights</h3>
          <p className="opacity-80 mt-3">
            Visual charts show where your money actually goes.
          </p>
        </div>

      </div>
    </div>
  </section>

  {/* SECTION 3 — WHY BUDGETING MATTERS */}
  <section className="py-28 px-6 bg-gradient-to-b from-transparent to-purple-50 dark:to-zinc-900">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold">Why Budgeting Matters?</h2>
      <p className="text-lg opacity-80 mt-4">
        Most people earn enough — they just don’t track where it goes.  
        That’s where FinanCio changes everything.
      </p>
    </div>

    {/* Benefit List */}
    <div className="max-w-5xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
      
      <div className="p-6 bg-white dark:bg-[#111] rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold">Clarity</h3>
        <p className="opacity-70 mt-2">
          Understand every rupee you spend.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-[#111] rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold">Control</h3>
        <p className="opacity-70 mt-2">
          Set budgets and stick to them effortlessly.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-[#111] rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold">Confidence</h3>
        <p className="opacity-70 mt-2">
          Make smarter financial decisions daily.
        </p>
      </div>

    </div>
  </section>

  {/* SECTION 4 — TIMELINE (USER FINANCIAL JOURNEY) */}
  <section className="py-32 px-6">
    <div className="max-w-6xl mx-auto">

      <h2 className="text-center text-4xl font-bold mb-16">
        Your Financial Transformation Journey
      </h2>

      <div className="relative border-l-4 border-[#B33791] dark:border-[#C562AF] pl-10 space-y-14">
        
        <div>
          <h3 className="text-2xl font-bold">Step 1: Create Your First Budget</h3>
          <p className="opacity-80 mt-2">Weekly, monthly or yearly — totally your choice.</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">Step 2: Add Daily Expenses</h3>
          <p className="opacity-80 mt-2">In less than 5 seconds per entry.</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">Step 3: Get Insights</h3>
          <p className="opacity-80 mt-2">Beautiful graphs show what’s going on.</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">Step 4: Improve Spending</h3>
          <p className="opacity-80 mt-2">Spend smarter and save more.</p>
        </div>

      </div>
    </div>
  </section>

  {/* SECTION — ZIGZAG APP TOUR */}
<section className="py-28 px-6">
  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-[#B33791] to-blue-400 bg-clip-text text-transparent">
      A Smarter Way to Manage Your Money
    </h2>
    <p className="mt-3 text-center text-lg text-gray-600 dark:text-gray-300">
      Explore how FinanCio simplifies your financial life.
    </p>

    <div className="mt-20 space-y-32">

      {/* ------------------ ROW 1 (IMG RIGHT) ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* Left Text */}
        <div>
          <h3 className="text-3xl font-bold mb-4 text-[#B33791]">
            📸 Scan Any Bill Instantly
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            Upload a photo of any bill, and FinanCio automatically extracts
            the title, amount, date, and category using advanced OCR.  
            Just upload and let it do the work for you.
          </p>
        </div>

        {/* Right Image */}
        <img
          src={image3}
          className="w-full h-[350px] object-cover rounded-3xl shadow-xl border border-white/10 dark:border-zinc-700"
        />
      </div>

      {/* ------------------ ROW 2 (IMG LEFT) ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* Left Image */}
        <img
          src={image2}
          className="w-full h-[350px] object-cover rounded-3xl shadow-xl border border-white/10 dark:border-zinc-700"
        />

        {/* Right Text */}
        <div>
          <h3 className="text-3xl font-bold mb-4 text-blue-500 dark:text-blue-300">
            🤖 Automatic Expense Filling
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            FinanCio reads the bill details and automatically fills the 
            expense form for you — store name, amount, date, and more.  
            Review and save with just one click.
          </p>
        </div>

      </div>

      {/* ------------------ ROW 3 (IMG RIGHT) ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* Left Text */}
        <div>
          <h3 className="text-3xl font-bold mb-4 text-[#B33791]">
            📩 Smart Budget Alerts
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            When your spending reaches 80% of your budget,  
            FinanCio sends you an instant email alert so you always stay
            in control and avoid unexpected overspending.
          </p>
        </div>

        {/* Right Image */}
        <img
          src={image4}
          className="w-full h-[350px] object-cover rounded-3xl shadow-xl border border-white/10 dark:border-zinc-700"
        />
      </div>

      {/* ------------------ ROW 4 (IMG LEFT) ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* Left Image */}
        <img
          src={image1}
          className="w-full h-[350px] object-cover rounded-3xl shadow-xl border border-white/10 dark:border-zinc-700"
        />

        {/* Right Text */}
        <div>
          <h3 className="text-3xl font-bold mb-4 text-blue-500 dark:text-blue-300">
            📊 Weekly AI Insights
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            Get automated weekly spending reports powered by AI.  
            Analyze trends, spot unnecessary expenses, and find new ways
            to save — all presented in a clear and visual format.
          </p>
        </div>

      </div>

    </div>

  </div>
</section>


  {/* SECTION 6 — FINAL CTA */}
  <section className="py-32 px-6 text-center">
    <h2 className="text-4xl font-bold">Ready To Take Control?</h2>
    <p className="text-lg opacity-80 mt-3">
      Build better habits. Make smarter choices.  
    </p>

    <button
      onClick={() => setShowSignup(true)}
      className="mt-8 px-10 py-4 text-xl bg-[#B33791] hover:bg-[#C562AF] text-white rounded-2xl shadow-lg transition-all"
    >
      Start Now
    </button>
  </section>
</div>


      




{/* lets start */}



         

      <footer className="bg-gray-900 text-white px-6 py-10 mt-16 font-Hubot">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo / Title */}
          <div>
            <h2 className="text-2xl font-bold text-[#B33791]  mb-2">FinanCio</h2>
            <p className="text-sm text-gray-400">
              Empowering you to take control of your money.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#support" className="hover:text-[#B33791] ">
                  Support
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-[#B33791] ">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#B33791] ">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: support@myfinanceapp.com</li>
              <li>Phone: +91-12345-67890</li>
              <li>Location: India</li>
            </ul>
          </div>

          {/* Newsletter (optional) */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Subscribe</h3>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none text-sm"
            />
            <button className="mt-3 w-full bg-[#B33791]  hover:bg-[#B33791]  text-white py-2 rounded text-sm">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MyFinanceApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
