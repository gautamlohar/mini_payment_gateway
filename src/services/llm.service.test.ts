import axios from 'axios';
import { getFraudExplanation } from './llm.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getFraudExplanation', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'fake-key';
    jest.clearAllMocks();
  });

  it('returns explanation from Gemini API', async () => {
    (mockedAxios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        candidates: [
          { content: { parts: [{ text: 'Gemini explanation.' }] } }
        ]
      }
    });
    const result = await getFraudExplanation({ amount: 100, currency: 'USD', source: 'tok_visa', email: 'user@example.com', score: 0 });
    expect(result).toBe('Gemini explanation. (via Gemini)');
  });

  it('returns fallback message on API error', async () => {
    (mockedAxios.post as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    const result = await getFraudExplanation({ amount: 100, currency: 'USD', source: 'tok_visa', email: 'user@example.com', score: 0 });
    expect(result).toMatch(/Could not generate explanation/);
  });
}); 