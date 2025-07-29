const request = require("supertest");

const BASE_URL = "http://localhost:5001"; 



describe("AuthController.regis", () => {
  it("should regis successfully with correct username and password", async () => {
    const res = await request(BASE_URL)
      .post("/auth/register")
      .send({
      
  "firstname": "doma",
  "lastname": "iiiiaq",
  "email": "qq@gmail.com",
  "username": "test1",
  "password": "doma",
  "bio": "ljlfkdajlfkasd",
  "role": "user",
 
  "gender": "Laki-Laki"

      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered");
  });

  it("should return 404 if user not found", async () => {
    const res = await request(BASE_URL)
      .post("/auth/login")
      .send({
       
      });

    expect(res.statusCode).toBe(500);
  });

  
});
