import express from 'express';
import 'dotenv/config';
import chargeRouter from './routes/charge.routes';
import transactionsRouter from './routes/transactions.routes';

const app = express();

app.use(express.json());
app.use('/charge', chargeRouter);
app.use('/transactions', transactionsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Mini Payment Gateway Proxy with LLM Risk Summary with Express + TypeScript!');
});

export default app; 