import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewCliente();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "POST") {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    await dbClient.end();
    return response.status(200).json(migrations);
  }

  if (request.method === "GET") {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
    });
    await dbClient.end();
    return response.status(200).json(migrations);
  } else {
    response.status(405).end();
  }
}
