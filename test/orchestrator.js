import database from 'infra/database';
import retry from 'async-retry';

async function waitForAllServices() {
  await waitForWebserver();

  async function waitForWebserver() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch('http://localhost:3000/api/v1/status');

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
    }
  }
}

async function clearDatabase() {
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
}

const orchestrator = { waitForAllServices, clearDatabase };

export default orchestrator;
