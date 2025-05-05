const request = require("supertest");

const BASE_URL = "http://localhost:5000"; // ganti dengan URL sesuai port kamu

describe("AuthController.login", () => {
  it("should login successfully with correct username and password", async () => {
    const res = await request(BASE_URL)
      .post("/auth/login")
      .send({
        username: "di",
        password: "di",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Login successful");
  });

  it("should return 404 if user not found", async () => {
    const res = await request(BASE_URL)
      .post("/auth/login")
      .send({
        username: "notfound",
        password: "anything",
      });

    expect(res.statusCode).toBe(404);
  });

  it("should return 401 if password is incorrect", async () => {
    const res = await request(BASE_URL)
      .post("/auth/login")
      .send({
        username: "di",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
  });
});
