// src/lib/authUtils.js
import jwt from 'jsonwebtoken';

export const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Cookie Options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // JS cannot read this (XSS Protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax' // CSRF protection
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token, // Optional: send back if needed for non-browser clients
      user: { id: user.id, email: user.email, name: user.name }
    });
};