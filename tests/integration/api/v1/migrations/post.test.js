import database from 'infra/database';

async function cleanDatabase() {
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
}

beforeAll(cleanDatabase);
const URI = 'http://localhost:3000';

test('POST to /api/v1/migrations should return 201', async () => {
  const response1 = await fetch(`${URI}/api/v1/migrations`, { method: 'POST' });
  const body1 = await response1.json();

  const migrationsCountResult = await database.query(
    'SELECT COUNT(*)::int FROM pgmigrations'
  );
  const migrationsCount = migrationsCountResult.rows[0].count;

  expect(response1.status).toBe(201);
  expect(Array.isArray(body1)).toBe(true);
  expect(migrationsCount).toBeGreaterThan(0);
  expect(body1.length).toEqual(migrationsCount);

  const response2 = await fetch(`${URI}/api/v1/migrations`, { method: 'POST' });
  const body2 = await response2.json();

  expect(response2.status).toBe(200);
  expect(Array.isArray(body2)).toBe(true);
  expect(body2.length).toEqual(0);
});
