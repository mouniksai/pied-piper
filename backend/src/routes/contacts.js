import express from 'express';
import { google } from 'googleapis';

const router = express.Router();

// Initialize the People API service
// Ensure your OAuth2 client is authenticated with the user's refresh token before this
const peopleService = google.people('v1');

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // The letter or name typed, e.g., "Al"
    
    // Retrieve the OAuth client from the request (Assuming you attach it via middleware)
    // Or initialize it here using the user's access token from the session
    const authClient = req.user.oauth2Client; 

    if (!query || query.length < 2) {
      return res.json({ results: [] });
    }

    const response = await peopleService.people.searchContacts({
      auth: authClient,
      query: query,
      readMask: 'names,emailAddresses,photos', // Only fetch what you need
      sources: ['READ_SOURCE_TYPE_CONTACT', 'READ_SOURCE_TYPE_PROFILE'], // Searches saved contacts and global directory
    });

    const results = response.data.results || [];

    // Transform data for your frontend
    const contacts = results.map((item) => {
      const person = item.person;
      return {
        name: person.names?.[0]?.displayName || 'Unknown',
        email: person.emailAddresses?.[0]?.value || null,
        photo: person.photos?.[0]?.url || null,
      };
    }).filter(c => c.email); // Filter out contacts without emails

    res.json({ contacts });

  } catch (error) {
    console.error('Error searching contacts:', error);
    res.status(500).json({ error: 'Failed to search contacts' });
  }
});

export default router;