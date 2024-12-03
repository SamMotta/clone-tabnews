import migrationsRunner from 'node-pg-migrate';
import database from 'infra/database';
import { join } from 'node:path';

/**
 *
 * @param {import("next").NextApiRequest} request
 * @param {import("next").NextApiResponse} response
 */
async function status(request, response) {
  const dbClient = await database.getNewClient();
  const allowedMethods = ['GET', 'POST'];

  if (allowedMethods.includes(request.method)) {
    const dryRun = request.method === 'GET';
    const migrations = await migrationsRunner({
      dbClient: dbClient,
      dryRun: dryRun,
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    });
    await dbClient.end();

    if (migrations.length > 0 && !dryRun) {
      return response.status(201).json(migrations);
    }

    return response.status(200).json(migrations);
  }

  response.status(405).end();
}

export default status;
