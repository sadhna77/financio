const express = require('express')
const router = express.Router();
const UserFinancio = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const dotenv = require('dotenv');
const { Signup, Login } = require('../controller/User');
dotenv.config();
const { ContactEmail } = require('../controller/email');
const { EditName, EditPassword, EditProfileImage,getUser } = require('../controller/User');




// chaho to login and signup function controllers m bhi bna skte ho 


// Register a new user (Sign Up)
router.post('/register', Signup )

// Login user (Authenticate)
router.post('/login',Login)

router.post('/contact-email',ContactEmail)
router.put("/edit-name", EditName);
router.put("/edit-password", EditPassword);
router.put("/edit-image", EditProfileImage);
router.get("/me", getUser);




module.exports = router;