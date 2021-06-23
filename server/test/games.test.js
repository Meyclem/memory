import { afterAll } from "@jest/globals"
import mongoDb from "mongodb"
import fetch from "node-fetch"
import { createApp } from "../src/server.mjs"
import { dropAll, initTestDatabase } from "./utils"

const sampleData = [
  {
    player: "player A",
    timeTaken: 10,
    isWon: true,
    attempts: 1,
  },
  {
    player: "player B",
    timeTaken: 10,
    isWon: true,
    attempts: 10,
  },
  {
    player: "player C",
    timeTaken: 11,
    isWon: true,
    attempts: 1,
  },
  {
    player: "player D",
    timeTaken: 20,
    isWon: false,
    attempts: 10,
  },
  {
    player: "player E",
    timeTaken: 20,
    isWon: false,
    attempts: 12,
  },
]

describe("#games-endpoints", () => {
  let client
  let database
  let server

  beforeAll(async () => {
    client = await initTestDatabase()
    database = client.db()
    await dropAll(database)
    const app = createApp(database)
    await new Promise((resolve) => (server = app.listen(3030, resolve)))
  })

  beforeEach(async () => {
    await dropAll(database)
  })

  afterAll(async (done) => {
    client.close()
    server.close(done)
  })

  describe("GET /games", () => {
    it("Should respond with the games stored in database", async () => {
      await database.collection("games").insertMany(sampleData)
      const response = await fetch("http://localhost:3030/games")
      const games = await response.json()

      expect(response.status).toBe(200)
      expect(games).toHaveLength(sampleData.length)
    })
  })

  describe("POST /games", () => {
    it("Should store the game data in the database", async () => {
      const gameData = {
        player: "player F",
        timeTaken: 10,
        isWon: false,
        attempts: 10,
      }
      const response = await fetch("http://localhost:3030/games", {
        method: "post",
        body: JSON.stringify(gameData),
        headers: {
          "content-type": "application/json",
        },
      })
      const game = await database.collection("games").findOne({ player: "player F" })

      expect(response.status).toBe(201)
      expect(game).toBeDefined()
      Object.entries(gameData).forEach(([key, value]) => {
        expect(game[key]).toBe(value)
      })
    })
  })
})
