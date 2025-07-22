import { v4 as uuidv4 } from 'uuid';

export type TransactionLog = {
  timestamp: string;
  transactionId: string;
  amount: number;
  currency: string;
  source: string;
  email: string;
  riskScore: number;
  status: 'routed' | 'blocked';
  explanation: string;
  provider?: string;
};

// In-memory storage for transaction logs
const transactionLogs: TransactionLog[] = [];

export const logTransaction = (transaction: TransactionLog): void => {
  transactionLogs.push(transaction);
};

export const getTransactions = (): TransactionLog[] => {
  return [...transactionLogs];
}; 

export const clearLogs = (): void => {
  transactionLogs.length = 0;
}