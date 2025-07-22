import { Router } from 'express';
import { getTransactions } from '../services/transactionLogger';

const router = Router();

router.get('/', (req, res) => {
  const transactions = getTransactions();
  res.json(transactions);
});

export default router; 