# Backend Issues & Stability Report

## 🚨 Critical Stability Issues (High Risk of Crash)

### 1. Missing Global Error Handling
**File:** `src/index.js`  
**Issue:** The application lacks a comprehensive global error handling middleware `(err, req, res, next)`.  
**Risk:** Exceptions thrown outside of controller `try...catch` blocks (e.g., in middleware, DB connection issues, or sync code) can cause Unhandled Promise Rejections or Uncaught Exceptions, leading to an immediate process crash and server downtime.

### 2. Missing Environment Variable Validation
**Files:** `src/index.js`, `/src/controllers/authController.js`, `src/services/aiService.js`  
**Issue:** Essential configuration like `JWT_SECRET`, `GEMINI_API_KEY`, and `GOOGLE_CLIENT_ID` are accessed directly without verification.  
**Risk:**
- If `JWT_SECRET` is missing, user authentication fails entirely.
- If `GEMINI_API_KEY` is missing, AI services crash on initialization.
- If missing at startup, the app might start but crash later during runtime operations.

---

## 🐛 Logical Bugs & Runtime Errors

### 3. Dangerous Iteration on User Input
**File:** `src/controllers/splitController.js`  
**Location:** Inside `splitTransaction` function  
**Issue:** The code iterates over `req.body.splits` using `for (const split of splits)` without verifying if `splits` is actually an array.  
**Risk:** If a malicious user or faulty frontend sends `null` or an object instead of an array, this throws a `TypeError`, resulting in a 500 Server Error instead of a proper 400 Bad Request response.

### 4. Unsafe Date & Number Parsing
**Files:** `src/controllers/transactionController.js`, `src/controllers/oracleController.js`  
**Issue:**  
- `new Date(startDate)` is used without validation.  
- `parseFloat(amount)` assumes valid input.  
**Risk:**  
- Invalid date strings result in `Invalid Date` objects, causing Prisma database queries to throw exceptions.
- `endOfMonth.getDate()` calculations on invalid dates return `NaN`, corrupting charts and dashboard data.

### 5. Hardcoded Google Cloud Topic Name
**File:** `src/services/gmailService.js`  
**Issue:** `topicName` is hardcoded to `'projects/build2break/topics/argos-gmail-topic'`.  
**Risk:** The Gmail watch functionality will fail if the project ID changes or if deployed to a different environment, potentially breaking the email integration feature.

### 6. Pagination Integer Parsing Risks
**File:** `src/controllers/transactionController.js`  
**Issue:** `parseInt(skip)` and `parseInt(limit)` are used on query parameters without fallback or validation.  
**Risk:** If parameters are missing or non-numeric (e.g., `?limit=abc`), `parseInt` returns `NaN`. Prisma queries expecting integers may fail or behave unpredictably.

---

## 🛡️ Recommended Fixes

1. **Global Error Handler:** Add a final middleware in `src/index.js` to catch stray errors.
2. **Env Check:** Validate all required environment variables on server startup (fail fast).
3. **Input Validation:** explicit checks for array types (`Array.isArray()`) and valid dates (`!isNaN(date.getTime())`) before processing.
