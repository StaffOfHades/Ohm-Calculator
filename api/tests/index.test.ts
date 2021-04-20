import request from "supertest";
import app from "../app";

describe("Test the root path", () => {
   test("It should response the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(['respond with a resource']);
  });
});
