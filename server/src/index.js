import dotenv from "dotenv"
import { createApp } from "./server.mjs"
import { initDatabase } from "./database.mjs"

dotenv.config()

initDatabase().then((client) => {
  const server = createApp(client.db())
  server.listen(process.env.PORT, () => {
    console.log(
      `🤖 Memory API started on ${process.env.API_URL ? process.env.API_URL : `http://localhost:${process.env.PORT}`}`,
    )
  })
})
