const mongoose = require('mongoose');

// Create User schema
const UserIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFinancio" },
  
 
  salary:{
    type: Number,
    required: true
  },
  bonus:{
    type: Number,
   
  },
  sideIncome:{
    type: Number,
   
  }
  ,
  totalIncome:{
    type:Number,
  }

  
  
});

module.exports = mongoose.model('UserIncome', UserIncomeSchema);
