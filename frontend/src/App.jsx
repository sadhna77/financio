import { useState } from "react";

import "./App.css";
import Signup from "./assets/components/Signup";
import { Routes, Route } from "react-router-dom";
import Login from "./assets/components/Login";
import { BrowserRouter } from "react-router-dom";
import { HeroSection } from "./assets/pages/HeroSection";
import { Dashboard } from "./assets/pages/Dashboard";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import Income from "./assets/components/Income";
import { Budget } from "./assets/components/Budget";
import { Savings } from "./assets/components/Savings";
import {Setting}  from './assets/components/Setting'
import {Plot} from './assets/components/Plot'
import { UserProvider } from "./assets/components/Context/UserContext";
import { Toaster } from 'sonner';
import { UserProfile } from "./assets/components/UserProfile";
import { ThemeContextProvider,useTheme } from "./assets/components/Context/ThemeContext";
import ExpenseTrendContainer from "./assets/components/ExpenseTrendContainer";




function App() {

  return (
    <>
    <ThemeContextProvider>
          <UserProvider>
      <BrowserRouter>
            <Toaster richColors position="top-center" />

      <Routes>
        <Route path="/"  element={<HeroSection/>}  />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Signup />} />
        {/* Protected Route */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="income" element={<Income />} />
          <Route path="budget" element={<ExpenseTrendContainer/>} />
          <Route path="savings" element={<Savings/>} />
          <Route path="setting" element={<Setting/>} />
          <Route path="plot" element={<Plot/>} />
        </Route>
        

      </Routes>
       
      </BrowserRouter>
      </UserProvider>
    </ThemeContextProvider>
    </>
  );
}

export default App;
