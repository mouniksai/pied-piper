// src/middlewares/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  let token;

  // 1. Check Cookie (Primary method)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Header (Fallback for Postman/API testing)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};