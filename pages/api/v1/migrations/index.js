import migrationsRunner from 'node-pg-migrate';
import database from 'infra/database';
import { resolve } from 'node:path';

/**
 *
 * @param {import("next").NextApiRequest} request
 * @param {import("next").NextApiResponse} response
 */
async function status(request, response) {
  const allowedMethods = ['GET', 'POST'];
  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} Not Allowed` });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const dryRun = request.method === 'GET';
    const migrations = await migrationsRunner({
      dbClient: dbClient,
      dryRun: dryRun,
      dir: resolve('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    });

    if (migrations.length > 0 && !dryRun) {
      return response.status(201).json(migrations);
    }

    return response.status(200).json(migrations);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

export default status;
