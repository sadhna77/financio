const express = require('express')
const router = express.Router();
const {Income} = require('../controller/Incomehnadling')
const dotenv = require('dotenv');
dotenv.config();
const verifyToken = require('../middlewares/verifytoken')
const {getIncome}= require('../controller/Incomehnadling')


router.post('/income',verifyToken,Income)
router.get('/income',getIncome)




module.exports = router;