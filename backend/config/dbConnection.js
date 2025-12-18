
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();




const connectDB = async()=>{
    try {
         await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  
        
    } catch (error) {

        console.log("some problem",error)

        
    }
}

module.exports = connectDB
