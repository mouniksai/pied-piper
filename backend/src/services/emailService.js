// src/services/emailService.js
import nodemailer from 'nodemailer';

// Configure Transport
let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  // Use Real Gmail if env vars are present
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log("📧 Using REAL Email Service");
} else {
  // Fallback to Ethereal for Dev/Testing
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'angelita.von@ethereal.email', 
      pass: 'nrC3j4zz64nJK7gxmr'
    }
  });
  console.log("📧 Using ETHEREAL Info (Fake Inbox)");
}

const getTemplate = (level, payerName, amount, merchant) => {
  const currency = "INR";
  
  switch(level) {
    case 'AGGRESSIVE':
      return {
        subject: `URGENT: Outstanding Debt of ${currency} ${amount}`,
        text: `ATTENTION. \n\nYou owe ${payerName} ${currency} ${amount} for ${merchant}. \n\nThis debt is past due. Immediate settlement is required. \n\n- ARGOS ENFORCER`
      };
    case 'FIRM':
      return {
        subject: `Reminder: You owe ${payerName} ${currency} ${amount}`,
        text: `Hi, \n\nJust a reminder to settle your share of ${currency} ${amount} for ${merchant} paid by ${payerName}. \n\nPlease pay at your earliest convenience.`
      };
    case 'POLITE':
    default:
      return {
        subject: `Quick update on expenses`,
        text: `Hey! \n\n${payerName} paid for ${merchant}. Your split is ${currency} ${amount}. \n\nCatch you later!`
      };
  }
};

export const sendNudge = async (toEmail, payerName, amount, merchant, level = 'POLITE') => {
  const content = getTemplate(level, payerName, amount, merchant);

  try {
    const info = await transporter.sendMail({
      from: '"ARGOS Enforcer" <no-reply@argos.finance>',
      to: toEmail,
      subject: content.subject,
      text: content.text,
    });
    
    console.log(`📧 Nudge sent to ${toEmail} (${level}). MessageId: ${info.messageId}`);
    // If using Ethereal, this link lets you view the fake email
    console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};