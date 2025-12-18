

const UserIncomeModal = require('../models/Income')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
require("dotenv").config();  // Loads environment variables from a `.env` file
const cors = require("cors");
const express = require("express");  // Imports Express framework for creating A
const app = express();  // Creates an Express app instance
app.use(express.json());  // Enables JSON parsing for incoming requests
app.use(cors());  // Allows cross-origin requests from frontend
const router = express.Router();



const Income = async (req, res) => {

  try{
      const {salary,bonus,sideIncome} = req.body;

          // If any of the fields are missing, return an error
    if (!salary || !bonus || !sideIncome) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user;


    const totalIncome = 
    (Number(salary) || 0) + 
    (Number(bonus) || 0) + 
    (Number(sideIncome) || 0);
  

    let userincome = await UserIncomeModal.findOne({userId})

    if (!userincome) {

      const new_userincome=  new UserIncomeModal({ userId, salary, bonus, sideIncome,totalIncome });
      await new_userincome.save();
      console.log("Income saved successfully");
      
    } else {
      userincome.salary = salary;
      userincome.bonus = bonus;
      userincome.sideIncome = sideIncome;
      userincome.totalIncome=totalIncome;
      await userincome.save();


      
    }

    res.status(200).json({ message: "Income saved successfully" });
  }

  catch (error) {
    console.error("Error saving income:", error);
    res.status(500).json({ message: "Server error" });
  }



  };


  const getIncome =async (req,res) => {
    
    const userId = req.query.userId;
    try {
      const salaryData = await UserIncomeModal.find({userId})
      res.send(salaryData)
      

      
    } catch (error) {
      
    }
    
  
    
  }
  

module.exports = { Income,getIncome };
