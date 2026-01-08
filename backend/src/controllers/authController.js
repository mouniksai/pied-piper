// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { sendTokenResponse } from '../lib/authUtils.js';

// Helper to generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 1. SIGNUP
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

export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};