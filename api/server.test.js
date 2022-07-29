// Write your tests here
const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

test("sanity", () => {
  expect(2).toBe(2);
});
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

beforeEach(async () => {
  await db("users").truncate();
});

describe("Endpoint tests", () => {
  describe("Register", () => {
    test("[01]Can register new user", async () => {
      let result = await request(server)
        .post("/api/auth/register")
        .send({ username: "bob", password: "1234" });
      expect(result.body).toMatchObject({ username: "bob", id: 1 });
    });
  });
});
