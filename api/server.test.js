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
    test("[02]Get proper response if trying to register taken username", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "bob", password: "1234" });
      let result = await request(server)
        .post("/api/auth/register")
        .send({ username: "bob", password: "1234" });
      expect(result.body).toEqual({ message: "username taken" });
    });
    test("[03]get proper response when missing password", async () => {
      let result = await request(server)
        .post("/api/auth/register")
        .send({ username: "bob" });
      expect(result.body).toEqual({
        message: "username and password required",
      });
    });
  });
  describe("Login", () => {
    test("[04]Can login with registered user", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "bob", password: "1234" });
      const result = await request(server)
        .post("/api/auth/login")
        .send({ username: "bob", password: "1234" });
      expect(result.body).toMatchObject({ message: "welcome, bob" });
    });
    test("[05]Cannot login with invalid credentials, proper response", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "bob", password: "1234" });
      const result = await request(server)
        .post("/api/auth/login")
        .send({ username: "bob", password: "123" });
      expect(result.body).toMatchObject({ message: "invalid credentials" });
    });
    test("[06]Proper response for missing username", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "bob", password: "1234" });
      const result = await request(server)
        .post("/api/auth/login")
        .send({ username: "bob" });
      expect(result.body).toMatchObject({
        message: "username and password required",
      });
    });
  });
  describe("Get", () => {
    test("[07]request without token have proper response", async () => {
      let result = await request(server).get("/api/jokes");
      expect(result.body).toEqual({ message: "token required" });
    });
    test("[08]request with invalid token have proper respons", async () => {
      const result = await request(server)
        .get("/api/jokes")
        .set("Authorization", "foobar");
      expect(result.body).toEqual({ message: "token invalid" });
    });
    test("[09]Obtains list of jokes with valid token", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "bob", password: "1234" });
      let result = await request(server)
        .post("/api/auth/login")
        .send({ username: "bob", password: "1234" });
      result = await request(server)
        .get("/api/jokes")
        .set("Authorization", result.body.token);
      expect(result.body).toHaveLength(3);
    });
  });
});
