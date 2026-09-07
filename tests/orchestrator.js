import retry from "async-retry";
import { faker } from "@faker-js/faker";
import database from "infra/database.js";
import migrator from "models/migrator";
import user from "models/user";
import sessions from "models/session";

const emailHTTPURL = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForWebServer();
  await waitForEmailServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status != 200) {
        throw Error();
      }
    }
  }
  async function waitForEmailServer() {
    return retry(fetchEmailServer, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchEmailServer() {
      const response = await fetch(`${emailHTTPURL}`);

      if (response.status != 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  return await user.create({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validPassword",
  });
}

async function createSession(userId) {
  return await sessions.create(userId);
}

async function deleteAllEmails() {
  await fetch(`${emailHTTPURL}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  const emailListResponse = await fetch(`${emailHTTPURL}/messages`);
  const emailListBody = await emailListResponse.json();
  const lastEmailItem = emailListBody.pop();
  const emailTextResponse = await fetch(
    `${emailHTTPURL}/messages/${lastEmailItem.id}.plain`,
  );
  const emailTextBody = await emailTextResponse.text();

  lastEmailItem.text = emailTextBody;

  return lastEmailItem;
}

const orchestrator = {
  waitForAllServices: waitForAllServices,
  clearDatabase: clearDatabase,
  runPendingMigrations: runPendingMigrations,
  createUser: createUser,
  createSession: createSession,
  deleteAllEmails: deleteAllEmails,
  getLastEmail: getLastEmail,
};

export default orchestrator;
