import migrationRunner from "node-pg-migrate";
import { resolve } from "path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";
const router = createRouter();

router.get(getMigrationsHandler);
router.post(postMigrationsHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getMigrationsHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewCliente();

    const getMigrationsHandler = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
    });
    return response.status(200).json(getMigrationsHandler);
  } finally {
    await dbClient?.end();
  }
}

async function postMigrationsHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewCliente();

    const postMigrationsHandler = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient: dbClient,
    });
    const statusCode = postMigrationsHandler.length > 0 ? 201 : 200;
    return response.status(statusCode).json(postMigrationsHandler);
  } finally {
    await dbClient?.end();
  }
}
