import { Client } from "pg";
import { ServicesError } from "infra/errors";

async function query(queryObject) {
  let client;
  try {
    client = await getNewCliente();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    throw new ServicesError({
      cause: error,
      message: "Erro na conexão com Banco ou na Query.",
      statusCode: 503,
    });
  } finally {
    await client?.end();
  }
}

function getSSLValues() {
  if (process.env.POSTGRES_SSL_CA) {
    return {
      ca: process.env.POSTGRES_SSL_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}

async function getNewCliente() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  getNewCliente: getNewCliente,
  query,
};

export default database;
