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

## Testing
Run all unit and integration tests:
```bash
npm test
```

## Project Structure
```
src/
  app.ts                # Express app setup
  index.ts              # Server entry point
  routes/
    charge.routes.ts    # /charge route
  controllers/
    charge.controller.ts# Controller for /charge
  services/
    fraud.service.ts    # Fraud risk logic
    llm.service.ts      # LLM integration (Gemini/OpenAI)
    transactionLogger.ts#Log transactions in memory.
```

## License
MIT 