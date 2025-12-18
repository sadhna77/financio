const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  console.log("token hai ye ", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    req.user = { _id: decoded.userId };
    console.log("id", req.user._id);
    console.log("passing through");

    next();
  } catch (err) {
   
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;
