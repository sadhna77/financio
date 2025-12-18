import React, { useContext, createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const userContext = createContext(); // Lowercase 'u' to avoid name clash

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [expenses, setExpenses] = useState("");
  const [token, setToken] = useState("");
  

  // On mount, decode token and set userId
  useEffect(() => {
    const storedToken = localStorage.getItem("authtoken");
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      setUserId(decoded.userId);
    }


  }, []);


   // Fetch expenses when userId is available
   useEffect(() => {
    if (!userId) return;

    const fetchExpenses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/exp/expense", {
          params: { userId },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses", err);
      }
    };

    fetchExpenses();
  }, [userId]); // dependency on userId
 






  return (
    <userContext.Provider value={{ userId, expenses, setExpenses, token }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
