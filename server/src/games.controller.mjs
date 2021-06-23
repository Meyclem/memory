/**
 * Initiate the POST handler to write new `games` in the database
 * @param database an instance of a MongoDB database
 * @returns An Express handler
 */
const post = (database) => async (request, response) => {
  const body = request.body
  try {
    const result = await database.collection("games").insertOne(body)
    const r = await database.collection("games").findOne({ player: body.player })
    response.status(201).send(result.ops[0])
  } catch (error) {
    response.status(500)
  }
}

/**
 * Initiate the GET handler to write new `games` in the database
 * @param database an instance of a MongoDB database
 * @returns An Express handler
 */
const get = (database) => async (_, response) => {
  const games = await database
    .collection("games")
    /**
     * This is and aggregation. It is a powerful tool and here it's used
     * to sort the results in this order:
     * - first: separated won games and lost games
     * - second: order them by the time taken to finish the game
     * - third: order them by the number of attempts
     *
     * Have a look at how aggregations works here: https://docs.mongodb.com/manual/aggregation/
     */
    .aggregate([
      {
        $sort: {
          isWon: -1,
          timeTaken: 1,
          attempts: 1,
        },
      },
    ])
    .toArray()

  response.status(200).json(games)
}

export { post, get }
