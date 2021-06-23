import request from "supertest"
import { createApp } from "../src/server.mjs"

describe("#createApp", () => {
  test("/: should always respond with a 200 status code and 'OK'", async () => {
    const app = createApp()
    const response = await request(app).get("/")

    expect(response.status).toBe(200)
  })
})
