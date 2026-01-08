// src/config/passport.js
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../lib/prisma.js'; // Note the .js extension!
import dotenv from 'dotenv';
dotenv.config();

export default function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_BASE_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Check if user exists
          let user = await prisma.user.findUnique({
            where: { googleId: profile.id },
          });

          // 2. Data payload
          const userData = {
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            accessToken: accessToken,
            // Google only sends refreshToken on FIRST consent. 
            // If we have it, update it. If not, keep the old one.
            ...(refreshToken && { refreshToken }), 
          };

          if (user) {
            // Update existing user
            user = await prisma.user.update({
              where: { googleId: profile.id },
              data: userData,
            });
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                ...userData,
              },
            });
          }
          return done(null, user);
        } catch (error) {
          console.error("Auth Error:", error);
          return done(error, null);
        }
      }
    )
  );
};