import { checkApiStatus, shuffle } from "../src/utils"

jest.mock("isomorphic-unfetch")
const fetch = require("isomorphic-unfetch")

const mockResponse = (wantedResponse) => () =>
  Promise.resolve({
    status: wantedResponse.status,
    json: () => Promise.resolve(wantedResponse.body),
  })

describe("#checkApiStatus", () => {
  // Make `console.log` silent during tests
  jest.spyOn(console, "log").mockImplementation(jest.fn)

  it("Should return 'Server started' if the server is responding with 'OK'", async () => {
    fetch.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: "OK",
      }),
    )
    const result = await checkApiStatus({ maxTry: 1 })
    expect(result).toBe("Server started")
  })

  it("Should throw an error when the server is not responding", async () => {
    try {
      fetch.mockImplementation(
        mockResponse({
          status: 404,
          body: {},
        }),
      )
      await checkApiStatus({ maxTry: 1, timeBetweenAttempts: 100 })
    } catch (error) {
      console.log(error.message)
      expect(error.message).toMatch("The server is not reponding")
    }
  })
})

describe("#shuffle", () => {
  it("Should randomize and return a new array", () => {
    const initialArray = new Array(10).fill().map((_, i) => i)
    const randomizedArray = shuffle(initialArray)
    expect(randomizedArray).not.toEqual(initialArray)
  })
})
