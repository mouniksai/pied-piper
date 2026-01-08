// src/lib/authUtils.js
import jwt from 'jsonwebtoken';

// Helper for consistent cookie options
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production' || 
                      (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost'));
  
  return {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction, // Must be true for SameSite=None
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };
};

export const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res
    .status(statusCode)
    .cookie('token', token, getCookieOptions())
    .json({
      success: true,
      token, // Important for Bearer auth fallback
      user: { id: user.id, email: user.email, name: user.name }
    });
};