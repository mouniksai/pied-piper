import { fetchRecentEmails } from '../services/gmailService.js';
import { parseTransactionWithAI } from '../services/aiService.js'; 
import prisma from '../lib/prisma.js';

export const handleGmailWebhook = async (req, res) => {
  try {
    // ... (keep the existing decoding logic) ...
    if (!req.body.message || !req.body.message.data) return res.status(400).send('Bad Request');
    const dataStr = Buffer.from(req.body.message.data, 'base64').toString();
    const { emailAddress } = JSON.parse(dataStr);
    
    const user = await prisma.user.findUnique({ where: { email: emailAddress } });
    if (!user) return res.status(200).send('OK');

    // 1. Fetch Emails
    const emails = await fetchRecentEmails(user.id);

    if (emails.length > 0) {
      console.log(`📥 Processing ${emails.length} emails...`);

      for (const email of emails) {
        // Prepare Data for AI
        const subject = email.payload.headers.find(h => h.name === 'Subject')?.value || "";
        const snippet = email.snippet; // Gmail gives a nice summary snippet
        const emailDate = new Date(parseInt(email.internalDate)).toISOString();

        // 2. AI Parsing
        console.log(`🤖 Asking Gemini to parse: "${subject}"...`);
        const parsedData = await parseTransactionWithAI(`${subject} ${snippet}`, emailDate);

        if (parsedData && parsedData.isTransaction) {
          // 3. Save to Database
          await prisma.transaction.create({
            data: {
              userId: user.id,
              gmailMessageId: email.id, // Idempotency Key!
              amount: parsedData.amount,
              currency: parsedData.currency,
              date: parsedData.date,
              merchant: parsedData.merchant,
              category: parsedData.category,
              bankName: parsedData.bankName,
              accountLast4: parsedData.accountLast4,
              rawEmailBody: snippet,
              source: 'GMAIL'
            }
          });
          console.log(`✅ Transaction Saved: ${parsedData.merchant} - ${parsedData.amount}`);
        } else {
          console.log(`⏭️ Skipped (Not a transaction or AI failed).`);
          // Optional: Mark as processed in a separate table so we don't fetch again?
          // For now, fetchRecentEmails handles exclusion via prisma check.
        }
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send('Server Error');
  }
};