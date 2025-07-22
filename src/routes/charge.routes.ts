import { Router } from 'express';
import { chargeController } from '../controllers/charge.controller';
import { getTransactions } from '../services/transactionLogger';

const router = Router();

router.post('/', chargeController);
router.get('/transactions', (req, res) => {
  res.json(getTransactions());
});

export default router; 