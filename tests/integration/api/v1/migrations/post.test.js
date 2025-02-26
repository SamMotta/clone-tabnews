import database from 'infra/database';
import orchestrator from 'test/orchestrator';

async function cleanDatabase() {
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
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

        const migrationsCountResult = await database.query(
          'SELECT COUNT(*)::int FROM pgmigrations'
        );
        const migrationsCount = migrationsCountResult.rows[0].count;

        expect(response.status).toBe(201);
        expect(Array.isArray(body)).toBe(true);
        expect(migrationsCount).toBeGreaterThan(0);
        expect(body.length).toEqual(migrationsCount);
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
