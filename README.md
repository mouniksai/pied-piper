# ARGOS | Context-Aware Financial Intelligence

ARGOS is a real-time financial tracking dashboard that automates expense management through direct Gmail integration. At its core, the system utilizes **Google Cloud Pub/Sub webhooks** to detect and process transaction alerts the instant they arrive in your inbox. This event-driven approach ensures that financial data is captured immediately, without the latency or overhead associated with traditional API polling.

Both the frontend and backend services are fully deployed and containerized, allowing for effortless setup and testing. Reviewers can pull the pre-built images directly from Docker Hub to run the application locally without complex environment configuration.

⚠️ Note on Demo Transaction Simulation
To facilitate testing during the hackathon, we have temporarily adjusted the sender verification logic. Since triggering live banking alerts via real transactions is impractical for a quick demonstration, ARGOS is currently configured to accept transaction-like emails from any sender.

For the purpose of this demo, you can trigger the system by sending an email from a personal account (or a friend's) to the connected inbox with a body like "Paid Rs 500 to Starbucks". The system will process these user-generated emails exactly as it would an official bank notification, allowing you to instantly verify the webhook latency and AI parsing capabilities.


## System Architecture

The application is built on a modern microservices-inspired architecture:

* **Frontend**: Next.js (React) dashboard for data visualization and interaction.
* *Source Repository*: [https://github.com/thecodingvivek/pp/](https://github.com/thecodingvivek/pp/)


* **Backend**: Node.js (Express) API handling authentication, business logic, and database operations.
* **Database**: PostgreSQL (via Prisma ORM) for relational data storage.
* **AI Engine**: Google Gemini Flash 1.5 for natural language processing and transaction extraction.
* **Ingestion**: Gmail Push Notifications (Webhooks) via Google Cloud Pub/Sub.

<img width="8191" height="3511" alt="architecture-diagram" src="https://github.com/user-attachments/assets/d1a5cdae-7b34-4ad6-9127-5f28e0cf2b23" />


### Key Differentiator: Webhook-Based Ingestion

ARGOS distinguishes itself by strictly avoiding polling mechanisms. Instead, it registers a secure webhook watch on the user's Gmail inbox. When a new email arrives, Google pushes a notification to our server immediately. The system then fetches the specific message, parses the financial details using AI, and updates the dashboard in near real-time. This architecture ensures immediate responsiveness and efficient resource usage.

## Features

1. **Real-Time Transaction Sync**: Expenses appear on the dashboard seconds after the payment confirmation email is received via webhook triggers.
2. **AI-Powered Parsing**: Extract merchant names, amounts, currencies, and categories from complex email bodies using Generative AI.
3. **Social Expense Splitting**: Seamlessly split bills with friends imported directly from Google Contacts.
4. **Debt Enforcement**: An automated "Nudge" system that sends email reminders to debtors with varying levels of urgency (Polite, Firm, Aggressive).
5. **Recurring Expenses**: Specialized tracking for fixed monthly costs like rent and subscriptions.

## Prerequisites

To run this project locally, ensure you have the following installed:

* **Docker Desktop** (and Docker Compose)
* **Ngrok** (Required for local testing of Gmail Webhooks)

## Installation and Setup

This project is containerized for easy deployment. You do not need to install Node.js or PostgreSQL locally to run the application, as the images are pulled directly from our registry.

### 1. Configuration

Navigate to the `infra` directory and create a `.env` file. You will need the following credentials:

```text
# infra/.env

# Database Configuration (Handled by Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=hackathonpassword
POSTGRES_DB=argos_db

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Authentication & AI
JWT_SECRET=your_secure_random_string
GEMINI_API_KEY=your_gemini_api_key

# Application URLs
PORT=4000
FRONTEND_URL=http://localhost:3000

```

### 2. Launching the Application

Run the following command from the `infra` folder to pull the deployed images and start the system:

```bash
cd infra
docker-compose up

```

This command will:

1. Pull the pre-built backend and frontend images from Docker Hub.
2. Initialize the PostgreSQL database schema.
3. Start all services on their respective ports.

### 3. Exposing Webhooks (Local Development Only)

Because Google's Pub/Sub service cannot reach your `localhost` directly, you must expose your backend port using Ngrok to test the live email ingestion feature.

```bash
ngrok http 4000

```

*Note: Update your Google Cloud Console "Pub/Sub Subscription" endpoint to match the URL provided by Ngrok.*

## Usage

Once the containers are running:

* **Frontend Dashboard**: Access the application at `http://localhost:3000`.
* **Backend API**: The API is available at `http://localhost:4000`.

### Login

Click "Continue with Google" to authenticate. You may see a verification warning screen; as this is a hackathon project, click "Advanced" and "Go to App (unsafe)" to proceed.

### Testing the Pipeline

1. Send an email to your connected Gmail account with a subject like "Transaction Alert".
2. Include body text such as: "Paid Rs 500 to Swiggy for food."
3. Watch the server logs or refresh the dashboard to see the transaction appear automatically via the webhook.

## API Documentation

The backend exposes several key endpoints for developers:

* `GET /auth/google`: Initiates the OAuth flow.
* `GET /api/transactions`: Retrieves paginated transaction history.
* `POST /api/transactions`: Manually create a transaction.
* `POST /api/splits`: Split a transaction with contacts.
* `POST /api/splits/nudge`: Trigger an email reminder for a specific debt.
