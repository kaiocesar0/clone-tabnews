import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migration should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migration", {
    method: "POST",
  });
  expect(response1.status).toBe(200);

  const response1Body = await response1.json();

  expect(Array.isArray(response1Body)).toBe(true);
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const Response2 = await fetch("http://localhost:3000/api/v1/migration", {
    method: "POST",
  });
  expect(Response2.status).toBe(200);

  const Response2Body = await Response2.json();

  expect(Array.isArray(Response2Body)).toBe(true);
  expect(Array.isArray(Response2Body)).toBe(true);
  expect(Response2Body.length).toBe(0);
});
