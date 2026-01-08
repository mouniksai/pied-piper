// src/services/gmailService.js
import { google } from 'googleapis';
import prisma from '../lib/prisma.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:4000/auth/google/callback'
);

// Helper: Get Authenticated Client for a User
const getGmailClient = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.refreshToken) throw new Error("Missing Refresh Token");

  oauth2Client.setCredentials({
    refresh_token: user.refreshToken,
    access_token: user.accessToken
  });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

// 1. START WATCHING (Call this once when user logs in)
export const watchGmail = async (userId) => {
  const gmail = await getGmailClient(userId);
  
  const res = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      topicName: 'projects/build2break/topics/argos-gmail-topic', // <--- REPLACE THIS LATER
      labelIds: ['INBOX'], // Only watch Inbox
    },
  });

  console.log(`👁️ ARGOS is watching mailbox for User ${userId}:`, res.data);
  return res.data;
};

// 2. PROCESS WEBHOOK (The difficult part)
export const processGmailUpdate = async (userId, startHistoryId) => {
  const gmail = await getGmailClient(userId);

  // Ask Google: "What changed since this History ID?"
  const history = await gmail.users.history.list({
    userId: 'me',
    startHistoryId: startHistoryId,
    historyTypes: ['messageAdded'],
  });

  const changes = history.data.history;
  if (!changes || changes.length === 0) return [];

  const newMessages = [];

  for (const record of changes) {
    if (record.messagesAdded) {
      for (const msg of record.messagesAdded) {
        // Fetch full email content
        const fullMsg = await gmail.users.messages.get({
          userId: 'me',
          id: msg.message.id,
          format: 'full',
        });
        
        newMessages.push(fullMsg.data);
      }
    }
  }

  return newMessages; // Array of raw email objects
};

export const fetchRecentEmails = async (userId) => {
  const gmail = await getGmailClient(userId);

  // 1. Get IDs of latest 5 emails in Inbox
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 1, // Grab last 5 to be safe
    labelIds: ['INBOX']
  });

  const messages = response.data.messages || [];
  const newEmails = [];

  for (const msg of messages) {
    // 2. CHECK DB: Have we processed this email ID before?
    const existing = await prisma.transaction.findUnique({
      where: { gmailMessageId: msg.id }
    });

    if (!existing) {
      // 3. If New, Fetch Full Content
      const fullMsg = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });
      newEmails.push(fullMsg.data);
    }
  }

  return newEmails;
};