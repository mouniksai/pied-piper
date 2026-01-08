# ARGOS - Financial Intelligence Engine

Argos is a comprehensive expense tracking and financial intelligence system. It syncs with your email to automatically parse transactions, categorize them using AI, and allow you to ask natural language questions about your finances.

## 🏗Tech Stack

* **Frontend:** Next.js (React)
* **Backend:** Node.js (Express)
* **AI Engine:** Python (Flask + PandasAI + Gemini)
* **Database:** PostgreSQL (Prisma)

---

##  Quick Start (Docker)

The easiest way to run the entire stack (Database, Backend, AI Service) is using Docker Compose.

### 1. Unzip the Repository



```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or update the existing one). You will need keys for Google Gemini and your database credentials.

```env
# Database
DATABASE_URL=""

# Google Auth & AI
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GEMINI_API_KEY="your_gemini_api_key"

# App URLs
CLIENT_URL="http://localhost:3000"
SERVER_URL="http://localhost:5000"

```

### 3. Build and Run

Run the following command to build all services and start the application:

```bash
docker-compose up --build

```

* **Frontend:** Access at `https://pp-eta-mauve.vercel.app/`
* **Backend API:** Access at `https://pied-piper-jcoc.onrender.com`


To stop the services, press `Ctrl+C` or run:

```bash
docker-compose down

```

---

## 🧪 How to Test AI Classification

Argos uses an intelligent parser to read transaction emails and categorize them automatically. Follow these steps to verify the classification works:

### 1. Connect your Gmail

Login to the Argos Dashboard (`http://localhost:3000`) and link your Google Account.

### 2. Send a Sample Transaction Email

Send an email **TO** your connected Gmail account (from a different email address) with the following sample content. This simulates a real bank or merchant notification.

**Subject:** Transaction Alert: Payment of INR 450.00
**Body:**

```text
Dear Customer, 

You have paid INR 450.00 to SWIGGY via UPI. 
Transaction ID: 123456789 
Date: 25-01-2026
Bank: HDFC Bank

```

### 3. Verify in Dashboard

1. Wait a moment for the system to poll your inbox (or click **Sync Now** in the dashboard).
2. Go to the **Transactions** tab.
3. You should see the transaction appear automatically.
4. **Check the Category:** The AI should have automatically classified this as **"Food & Dining"** or **"Food"** based on the merchant "SWIGGY".

---

## 🛠 Troubleshooting

* **"Oauth Redirect Mismatch":** Ensure your Google Cloud Console "Authorized Redirect URIs" matches `http://localhost:5000/auth/google/callback`.
* **Docker Database Connection:** If the backend fails to connect to the DB immediately, wait a few seconds; the container will retry until the database is ready.
