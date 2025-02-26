import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

const URI = 'http://localhost:3000';

describe('POST /api/v1/migrations', () => {
  describe('Anonymous user', () => {
    describe('Retrieving pending migrations', () => {
      test('For the first time', async () => {
        const response = await fetch(`${URI}/api/v1/migrations`, {
          method: 'POST',
        });
        const body = await response.json();

        expect(response.status).toBe(201);
        expect(Array.isArray(body)).toBe(true);
      });

      test('For the second time', async () => {
        const response = await fetch(`${URI}/api/v1/migrations`, {
          method: 'POST',
        });
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toEqual(0);
      });
    });
  });
});
