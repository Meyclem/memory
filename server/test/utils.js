import mongoDb from "mongodb"

async function dropCollection(db, collectionName) {
  return new Promise((resolve, reject) => {
    db.dropCollection(collectionName, (error, result) => {
      if (error && error.message.includes("ns not found")) {
        resolve(true)
      } else if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

async function dropCollections(db, collections) {
  let operations = []

  const promises = []

  collections.forEach((collection) => promises.push(dropCollection(db, collection)))

  operations = await Promise.all(promises)

  return operations
}

/**
 * ⚠️ This function deletes all collections inside a database, use with caution ⚠️
 * @param {Object} db an instance of a MongoDB database
 */
async function dropAll(db) {
  const collections = await db
    .listCollections()
    .toArray()
    .then((collectionsName) => collectionsName.map((name) => name.name))

  await dropCollections(db, collections)
}

const baseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
}

const initTestDatabase = () =>
  new Promise((resolve, reject) => {
    mongoDb.MongoClient.connect(
      "mongodb://memory-api:password@localhost:27016/memory",
      baseOptions,
      (error, client) => {
        if (error) {
          reject(error)
        } else {
          resolve(client)
        }
      },
    )
  })

export { dropAll, initTestDatabase }
