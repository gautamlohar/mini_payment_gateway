# Mini Payment Gateway Proxy with LLM Risk Summary

This project is a Node.js + TypeScript Express API that simulates a payment gateway proxy. It evaluates fraud risk using simple heuristics and generates a human-readable risk summary using an LLM (Gemini or OpenAI).

## Features
- **POST /charge**: Accepts payment details, evaluates fraud risk, and returns a risk summary from an LLM.
- **LLM Support**: Uses Gemini by default, falls back to OpenAI if Gemini fails.
- **Modular Structure**: Clean separation of app, routes, controllers, and services.
- **Unit & Integration Tests**: Jest and Supertest for robust testing.

## Setup

### 1. Clone the repository
```bash
# Replace with your repo URL if needed
git clone <repo-url>
cd expressproject
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root and add your API keys:
```env
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```
- Only one is required, but both is recommended for fallback.

### 4. Build the project
```bash
npm run build
```

### 5. Run the server
- For production:
  ```bash
  npm start
  ```
- For development (with hot reload):
  ```bash
  npm run dev
  ```

The server will start on `http://localhost:3000` by default.

## API Usage

### POST /charge
**Request Body:**
```json
{
  "amount": 1000,
  "currency": "USD",
  "source": "tok_visa",
  "email": "user@example.com"
}
```
**Response:**
- 200: Routed to payment gateway, includes fraud score and LLM explanation.
- 403: Blocked due to high fraud risk, includes fraud score and LLM explanation.
- 400: Invalid input.

## Fraud Detection Logic

### The app evaluates fraud risk based on simple heuristics:
- Amount-Based Risk: Transactions over $500 contribute significantly to risk score.
 - Email Domain Check: Suspicious domains like .ru and test.com increase the fraud risk.
 - Score & Decision:
```bash
  - Risk score ranges from 0 to 1.
  - A score >= 0.5 results in the transaction being blocked. 
  - Lower-risk transactions are randomly routed to either Stripe or PayPal.
```
### Example Heuristic Logic:
```bash
  if (amount > 500) score += 0.5;
  if (email ends with '.ru' or 'test.com') score += 0.5;
  if (score >= 0.5) block transaction; else route to gateway.
```

## LLM-Powered Risk Explanation

### After fraud scoring, the app generates a plain-English explanation using an LLM (Large Language Model):
  - Primary LLM: Google Gemini API
  - Fallback LLM: OpenAI's ChatGPT (gpt-3.5-turbo)
  - Prompts include key metadata like: amount, currency, source, email, and the final fraud score.

### Sample Prompt to LLM:
- A payment request was scored for fraud risk.
```bash
  payload

  {
    "amount": 1000,
    "currency": "USD",
    "source": "tok_visa",
    "email": "user@example.com"
  }
```
### The LLM responds with a natural language explanation such as:
-The payment request for $1000 USD from a Visa token with the email user@example.com received a fraud score of 0.5, indicating a moderate level of potential fraud based on the provided details. (via Gemini)

## Testing
Run all unit and integration tests:
  - Delete dist folder from your local.
```bash
npm test
```

## Project Structure
```
src/
  app.ts                     # Express app setup
  index.ts                   # Server entry point
  routes/
    charge.routes.ts         # /charge route
    transactions.routes.ts   # /transactions route
  controllers/
    charge.controller.ts     # Controller for /charge
  services/
    fraud.service.ts         # Fraud risk logic
    llm.service.ts           # LLM integration (Gemini/OpenAI)
    transactionLogger.ts     #Log transactions in memory.
```

## License
MIT 