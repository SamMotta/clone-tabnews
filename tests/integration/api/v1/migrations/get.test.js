import database from 'infra/database';

async function cleanDatabase() {
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
}

beforeAll(cleanDatabase);
const URI = 'http://localhost:3000';

test('GET to /api/v1/migrations should return 200', async () => {
  const response = await fetch(`${URI}/api/v1/migrations`);
  expect(response.status).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  const migrationsCountResult = await database.query(
    'SELECT COUNT(*)::int FROM pgmigrations'
  );
  const migrationsCount = migrationsCountResult.rows[0].count;
  expect(migrationsCount).toEqual(0);
});
