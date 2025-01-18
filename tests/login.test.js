const request = require("supertest");
const app = require("../app");

describe("Login Controller", () => {
   it("should return status 200 and a token", async () => {
       const response = await request(app)
           .post("/api/users/login")
           .send({ email: "users@account.com", password: "parola123" });

       expect(response.status).toBe(200);
       expect(response.body.token).toBeDefined();
       expect(response.body.user).toEqual({
           email: expect.any(String),
           subscription: expect.any(String),
       });
   });
});
