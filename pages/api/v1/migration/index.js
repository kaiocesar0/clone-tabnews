import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not alowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewCliente();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const migrations = await migrationRunner({
        ...defaultMigrationOptions,
      });
      return response.status(200).json(migrations);
    }

    if (request.method === "POST") {
      const migrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      return response.status(200).json(migrations);
    }

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
