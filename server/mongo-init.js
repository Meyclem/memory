/* global db */

db.createUser({
  user: "memory-api",
  pwd: "password",
  roles: [{ role: "readWrite", db: "memory" }],
})
