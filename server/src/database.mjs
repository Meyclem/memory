import mongoDb from "mongodb"

const baseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
}

/**
 * This function is used to contact the database and get a client
 * @returns {Promise} if the connection to the database succed, returns a `promise` with the client
 */
async function initDatabase() {
  return new Promise((resolve, reject) => {
    mongoDb.MongoClient.connect(`${process.env.DATABASE_URL}`, baseOptions, async (error, client) => {
      if (error) {
        reject(error)
      } else {
        resolve(client)
      }
    })
  })
}

export { initDatabase }
