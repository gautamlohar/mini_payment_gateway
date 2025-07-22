import { evaluateFraudRisk } from './fraud.service';

describe('evaluateFraudRisk', () => {
  it('should return low score and not block for safe input', () => {
    const result = evaluateFraudRisk(100, 'user@example.com');
    expect(result.score).toBe(0);
    expect(result.blocked).toBe(false);
    expect(['stripe', 'paypal']).toContain(result.routedGateway);
  });

  it('should block for high amount', () => {
    const result = evaluateFraudRisk(1000, 'user@example.com');
    expect(result.score).toBeGreaterThanOrEqual(0.5);
    expect(result.blocked).toBe(true);
    expect(result.routedGateway).toBeUndefined();
  });

  it('should block for suspicious email', () => {
    const result = evaluateFraudRisk(100, 'user@test.com');
    expect(result.score).toBeGreaterThanOrEqual(0.5);
    expect(result.blocked).toBe(true);
    expect(result.routedGateway).toBeUndefined();
  });

  it('should block for both high amount and suspicious email', () => {
    const result = evaluateFraudRisk(1000, 'user@test.com');
    expect(result.score).toBe(1);
    expect(result.blocked).toBe(true);
    expect(result.routedGateway).toBeUndefined();
  });
}); 