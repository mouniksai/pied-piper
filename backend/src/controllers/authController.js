// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { sendTokenResponse, getCookieOptions } from '../lib/authUtils.js';

// Helper to generate Token (Deprecated in favor of central authUtils, but kept if needed locally)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log(req.body);
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log("Before Existing User Check");
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("Checkpoit 1")
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        // googleId is null for direct users
      },
    });

    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is Google-only (no password set)
    if (!user.password) {
      return res.status(400).json({ message: "Please log in with Google" });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { budget } = req.body;
    
    // Validate
    if (!budget || isNaN(budget)) {
      return res.status(400).json({ message: "Invalid budget amount" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { monthlyBudget: parseFloat(budget) }
    });

    res.json({ success: true, budget: Number(updatedUser.monthlyBudget) });
  } catch (error) {
    console.error("Update Budget Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  const options = getCookieOptions();
  
  // Clear the token cookie
  res.clearCookie('token', options);

  // Also try to clear any other cookies found in request with the same options
  // Note: We can't know exact path/domain of random cookies, but we try default options
  for(const cookie in req.cookies) {
    if (cookie === 'token') continue; 
    res.clearCookie(cookie, options);
  }

  return res.json({ success: true, message: "Logged out successfully" });
};