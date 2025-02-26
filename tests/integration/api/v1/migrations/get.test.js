import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

const URI = 'http://localhost:3000';

describe('GET /api/v1/migrations', () => {
  describe('Anonymous user', () => {
    test('Running pending migrations', async () => {
      const response = await fetch(`${URI}/api/v1/migrations`);
      expect(response.status).toBe(200);

      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });
  });
});
