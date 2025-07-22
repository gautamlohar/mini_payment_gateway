export function evaluateFraudRisk(amount: number, email: string) {
  let score = 0;
  if (amount > 500) score += 0.5;
  const suspiciousDomains = ['.ru', 'test.com'];
  const emailDomain = email.split('@')[1] || '';
  if (suspiciousDomains.some(domain => emailDomain.endsWith(domain))) {
    score += 0.5;
  }
  if (score > 1) score = 1;

  if (score >= 0.5) {
    return { score, blocked: true };
  }

  const gateways = ['stripe', 'paypal'];
  const routedGateway = gateways[Math.floor(Math.random() * gateways.length)];
  return { score, routedGateway, blocked: false };
} 