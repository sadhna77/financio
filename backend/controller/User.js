
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
const UserFinancio = require('../models/User');  // Imports the User model for database operations 


// Register a new user (Sign Up)
const Signup =async (req, res) => {
  const { name, email, password } = req.body;
  const errors = {};

  // --- Validations ---
  if (!/^[a-zA-Z ]{3,}$/.test(name)) {
    errors.name = "Invalid name. Use at least 3 letters, only alphabets.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format.";
  }

  if (password.length < 8 ) {
    errors.password = " Must be 8+ chars ";
  }

  // If there are validation errors, send all of them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if user already exists
    const existingUser = await UserFinancio.findOne({ email });
   
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    else{
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UserFinancio({
      name,
      email,
      password: hashedPassword
    });
  

    // Save user to database
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Respond with token
    res.status(201).json({ token });
  }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}


const Login =  async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", { email, password });

  try {
    // Find user by email
   
    const user = await UserFinancio.findOne({ email });
    if (!user) {
      
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token
    res.status(200).json({ token , message:"Login successful",email:user.email,name:user.name});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const EditPassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be 8+ characters" });
  }

  try {
    const user = await UserFinancio.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Edit Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const EditProfileImage = async (req, res) => {
    try {
        const { userId, profileImage } = req.body;

        if (!userId || !profileImage) {
            return res.status(400).json({ message: "Missing data" });
        }

        const user = await UserFinancio.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profilePic = profileImage;

        await user.save();

        res.json({
            message: "Image updated",
            profilePic: user.profilePic
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const EditName = async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: "userId and name required" });
    }

    const user = await UserFinancio.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Name updated", user });
  } catch (err) {
    console.error("EditName Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER DETAILS
const getUser = async (req,res)=>{
    try{
        const user = await UserFinancio.findById(req.query.userId);

        return res.json({
            name: user.name,
            email: user.email,
            profilePic: user.profilePic
        });
    }catch(err){
        res.status(500).send("Error");
    }
};






module.exports = { 
  Signup, 
  Login,
  EditName,
  EditPassword,
  EditProfileImage,
  getUser
};
