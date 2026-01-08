// src/services/contactService.js
import { google } from 'googleapis';
import prisma from '../lib/prisma.js';

export const fetchGoogleContacts = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user || !user.refreshToken) throw new Error("No Google credentials found");

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    refresh_token: user.refreshToken,
    access_token: user.accessToken
  });

  const service = google.people({ version: 'v1', auth });

  const response = await service.people.connections.list({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos',
    pageSize: 100, // Fetch top 100 contacts
    sortOrder: 'LAST_MODIFIED_DESCENDING' // Most frequent/recent first
  });

  // Transform to clean JSON
  const contacts = (response.data.connections || []).map(person => ({
    name: person.names?.[0]?.displayName || "Unknown",
    email: person.emailAddresses?.[0]?.value || null,
    photo: person.photos?.[0]?.url || null
  })).filter(c => c.email); // Only return contacts with emails

  return contacts;
};