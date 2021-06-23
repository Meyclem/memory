# The backend application

## The server

The server uses [**Express**](https://expressjs.com/) to create the routes.

It is composed of only two important endpoints:
- `GET /games`: retrieves the games stored in the database
- `POST /games`: adds a new game to the database

Following the Express documentation, create an API is as simple as:
```js
import express from "express"

app.get("/", (request, response) => {
  response.send("Hello world!")
})
```

But of course, we need more, as you can see in `server/src/server.mjs`:
- **morgan**: to print logs in the server window so we can see clearly what happens
- **cors**: so the API can be contacted by the front-end, through the browser

The server creation is encapsulated in the `createApp` function and imported in `server/src/index.js`

## The database

As you have probably guessed, we will need to connect our API to the database to store games.

### What is MongoDB

Our Database of choice is MongoDB.

It is a **document oriented database**, meaning *pretty much* Javascript `Object`s, organised in collections.

For the Memory game, we will have only **one collection**: `games` and each game will be stored as **one document** under this format:
```ts
{
  player: string; // the name of the player
  timeTaken: number; // the time the played needed to complete the game, in seconds
  isWon: boolean; // wheter the player has finished the game or ran out of time
  attempts: number; // the number of attempts the played needed to find all the fruits
}
```

### Connect to the database

In local development, it is started through **Docker** and more precisely, with the `docker compose up` command.

This command reads the `server/docker-compose.yml` configuration file. Long story short, it avoids us to have to install and run an instance of the database on the computer and allows us to have the same version of the database that don't depends on the computer's configuration.

The commands also creates a `memory` database with a user named `memory-api` and with a password set to `password` (yes, you read it right 😅). But don't be afraid, since it's on your computer, no one else can access it! (And it is simple to keep in mind 😉)

When the database is started, we can access it through the terminal with this command:
```sh
mongo <database-name> -u <user-name> -p <password>

# So in our case
mongo memory -u memory-api -p password
```

![](./images/connect-to-mongo-with-terminal.png)
> With the terminal...

![](./images/connect-to-mongo-with-compass.png)
> Or with [MongoDB compass](https://www.mongodb.com/products/compass) on the url `mongodb://memory-api:password@localhost:27017/memory?authSource=memory`
> 😍

And of course, with Javascript code!! 🤩

```js
import mongoDB from "mongodb"

const baseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoDb.MongoClient.connect("<your-database-url>", baseOptions, (error, client) => {
  if (error) {
    // Do what you want if there's an error during the connection
  } else {
    const database = client.db()
    // Do what you want with the database
  }
})
```

This piece of code is encapsulated inside an `async` function in `server/src/database.mjs` so we can import and use it where we initialize the server because we will need to access the database in in our endpoints! (to **C**reate and **R**ead games, remember **CRUD**? 😁)

Look at the file to see how we create the app and pass it the database so the express handlers can get it.

### More

For Further details, read the comments written in `server/src` 😉.

Important functions are commented with [jsdocs](https://jsdoc.app/) to give you hints on hover 👀.

### Tests

Have a look at the tests sample you can find in `server/test`.

It is not complete because the current tests don't cover all the cases but it's an exemple of how you can test API endpoints with `jest`!

