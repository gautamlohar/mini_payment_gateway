import request from 'supertest';

// Mock Gemini API call
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      candidates: [
        { content: { parts: [{ text: 'Mocked Gemini explanation.' }] } }
      ]
    }
  })
}));

import app from '../app';

describe('/charge endpoint', () => {
  const validPayload = {
    amount: 100,
    currency: 'USD',
    source: 'tok_visa',
    email: 'user@example.com',
  };

  describe('Valid requests', () => {
    it('routes a low-risk charge to a gateway', async () => {
      const res = await request(app)
        .post('/charge')
        .send(validPayload);
      expect(res.status).toBe(200);
      expect(['stripe', 'paypal']).toContain(res.body.provider);
      expect(res.body.riskScore).toBeLessThan(0.5);
      expect(res.body.explanation).toBeDefined();
    });

    it('blocks a high amount charge', async () => {
      const res = await request(app)
        .post('/charge')
        .send({ ...validPayload, amount: 1000 });
      expect(res.status).toBe(403);
      expect(res.body.riskScore).toBeGreaterThanOrEqual(0.5);
      expect(res.body.explanation).toBeDefined();
    });

    it('blocks a suspicious email domain', async () => {
      const res = await request(app)
        .post('/charge')
        .send({ ...validPayload, email: 'user@test.com' });
      expect(res.status).toBe(403);
      expect(res.body.riskScore).toBeGreaterThanOrEqual(0.5);
      expect(res.body.explanation).toBeDefined();
    });
  });

  describe('Invalid requests', () => {
    it('returns 400 for invalid input', async () => {
      const res = await request(app)
        .post('/charge')
        .send({ ...validPayload, amount: 'not-a-number' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
}); 