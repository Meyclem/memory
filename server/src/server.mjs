import express from "express"
import cookieParser from "cookie-parser"
import logger from "morgan"
import http from "http"
import cors from "cors"
import * as gameController from "./games.controller.mjs"

const defaultLogger = logger("dev", { skip: () => process.env.NODE_ENV === "test" })

/**
 * Function used to create an Express application with 3 endpoints:
 * - `GET /`: just to check if the API si started
 * - `GET /games`: to get the games from the database
 * - `POST /games`: to create new games in the database
 * @param database an instance of a MongoDB database
 * @returns Express application
 */
function createApp(database) {
  const app = express()
  app.use(defaultLogger)
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(cors())

  app.get("/", (request, response) => {
    response.json("OK")
  })

  app.post("/games", gameController.post(database))
  app.get("/games", gameController.get(database))

  return http.createServer(app)
}

export { createApp }
