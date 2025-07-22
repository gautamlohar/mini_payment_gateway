import { logTransaction, getTransactions, TransactionLog, clearLogs } from './transactionLogger';

describe('transactionLogger', () => {
  beforeEach(() => {
    // Clear the logs by directly accessing the array (not exported, so workaround is to log a dummy and reset)
    // In a real-world scenario, you might want to add a clear function for testability.
    clearLogs(); 
    (getTransactions() as TransactionLog[]).splice(0, getTransactions().length);
  });

  it('should log a transaction and retrieve it', () => {
    const transaction: TransactionLog = {
      timestamp: new Date().toISOString(),
      transactionId: 'test-id',
      amount: 100,
      currency: 'USD',
      source: 'tok_visa',
      email: 'user@example.com',
      riskScore: 0.1,
      status: 'routed',
      explanation: 'Test explanation',
      provider: 'stripe',
    };
    logTransaction(transaction);
    const logs = getTransactions();
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual(transaction);
  });

  it('should return a copy of the logs array (immutability)', () => {
    const transaction: TransactionLog = {
      timestamp: new Date().toISOString(),
      transactionId: 'test-id-2',
      amount: 200,
      currency: 'EUR',
      source: 'tok_mastercard',
      email: 'user2@example.com',
      riskScore: 0.2,
      status: 'blocked',
      explanation: 'Blocked explanation',
      provider: 'paypal',
    };
    logTransaction(transaction);
    const logs = getTransactions();
    logs.push({ ...transaction, transactionId: 'should-not-affect-original' });
    const logsAfter = getTransactions();
    expect(logsAfter.length).toBe(1);
    expect(logsAfter[0].transactionId).toBe('test-id-2');
  });
}); 