import fetch from "isomorphic-unfetch"

/**
 * Used to check if the API is responding because it is hosted on another server.
 * @param {Object} settings Needed parameters for recursive calls to the server
 * @param {number} settings.tryNymber The current number of the try in the recursion loop
 * @param {number} settings.maxTry The maximum number of tries before the function fails
 * @param {number} settings.timeBetweenAttempts The time between each attemp
 * @default { maxTry = 12, tryNymber = 1, timeBetweenAttempts = 5000 }
 */

async function checkApiStatus({ maxTry = 12, tryNymber = 1, timeBetweenAttempts = 5000 } = {}) {
  const response = await fetch(process.env.API_BASE_URL)
  const body = await response.json()
  return new Promise((resolve, reject) => {
    if (response.status === 200 && body === "OK") {
      resolve("Server started")
    } else if (tryNymber <= maxTry) {
      console.log(`Attempt n° ${tryNymber} to wake up the server`)
      setTimeout(async () => {
        resolve(checkApiStatus({ maxTry, tryNymber: tryNymber + 1 }))
      }, timeBetweenAttempts)
    } else if (tryNymber > maxTry) {
      reject(new Error("The server is not reponding.\nIf you are the owner, please look at the logs."))
    }
  })
}

export { checkApiStatus }
