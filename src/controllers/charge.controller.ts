import { Request, Response } from 'express';
import { evaluateFraudRisk } from '../services/fraud.service';
import { getFraudExplanation } from '../services/llm.service';
import { logTransaction } from '../services/transactionLogger';
import { v4 as uuidv4 } from 'uuid';

export async function chargeController(req: Request, res: Response) {
  const { amount, currency, source, email } = req.body;

  if (
    typeof amount !== 'number' ||
    typeof currency !== 'string' ||
    typeof source !== 'string' ||
    typeof email !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid request body. Required: { amount: number, currency: string, source: string, email: string }' });
  }

  const transactionId = uuidv4();
  const timestamp = new Date().toISOString();
  const { score: riskScore, routedGateway, blocked } = evaluateFraudRisk(amount, email);
  const explanation = await getFraudExplanation({ amount, currency, source, email, score: riskScore });

  const transactionLog = {
    timestamp,
    transactionId,
    amount,
    currency,
    source,
    email,
    riskScore,
    status: blocked ? 'blocked' as const : 'routed' as const,
    explanation,
    provider: routedGateway
  };

  logTransaction(transactionLog);

  if (blocked) {
    return res.status(403).json({
      transactionId,
      message: 'Transaction blocked due to high fraud risk',
      riskScore,
      status: 'blocked',
      explanation
    });
  }

  return res.status(200).json({
    transactionId,
    provider: routedGateway,
    status: 'success',
    riskScore,
    explanation
  });
} 