/**
 * @jest-environment jsdom
 */

import { Game } from "../src/game"

jest.mock("isomorphic-unfetch")
const fetch = require("isomorphic-unfetch")

const mockResponse = (wantedResponse) => () =>
  Promise.resolve({
    status: wantedResponse.status,
    json: () => Promise.resolve(wantedResponse.body),
  })

describe("#Game", () => {
  let gameContainer
  const config = { gridSize: 28, timeOut: 500 }

  beforeAll(() => {
    fetch.mockImplementation(
      mockResponse({
        status: 200,
        body: [
          {
            player: "player A",
            timeTaken: 10,
            isWon: true,
            attempts: 1,
          },
        ],
      }),
    )
  })

  beforeEach(() => {
    gameContainer = document.createElement("div")
    gameContainer.setAttribute("id", "game")
  })

  it("Should initialize an HTML '.grid' element", () => {
    const game = new Game(gameContainer)
    expect(game.gameContainer.querySelector(".grid")).toBeDefined()
  })

  it(`Should randomly generate 'fruits' property with ${config.gridSize} random fruits`, () => {
    const fruitsA = new Game(gameContainer).getRandomFruits()
    expect(fruitsA).toHaveLength(28)
    const fruitsB = new Game(gameContainer).getRandomFruits()
    expect(fruitsB).toHaveLength(28)
    expect(fruitsA).not.toEqual(fruitsB)
  })

  it(`Should have a 'cards' property containing ${config.gridSize} html cards`, () => {
    const game = new Game(gameContainer)
    expect(game.cards).toBeDefined()
    expect(game.cards).toHaveLength(28)
  })

  test("Each card should change on click event", async () => {
    const game = new Game(gameContainer)

    const clickCard = async (card, index) =>
      new Promise((resolve) => {
        expect(card).toBeInstanceOf(HTMLDivElement)
        expect(card.classList).toContain("card")
        expect(card.classList).toContain("not-revealed")
        card.click()
        setTimeout(() => {
          expect(card.classList).toContain("card")
          expect(card.classList).not.toContain("not-revealed")
          expect(card.classList).toContain("revealed")
          expect(card.classList.toString()).toContain(`${game.fruits[index]}`)
          resolve()
        }, 500)
      })

    await Promise.all(game.cards.map((card, index) => clickCard(card, index)))
  })

  it("Should keep the first selected card in memory wainting for the second choice", () => {
    const game = new Game(gameContainer)
    const firstCard = game.cards[0]
    firstCard.click()
    expect(game.currentMatch).toHaveLength(1)
    expect(game.currentMatch[0].index).toBe(0)
    expect(game.currentMatch[0].selectedCard).toEqual(firstCard)
  })

  it("Should reset the 'currentMatch' property in case of no match", async () => {
    const game = new Game(gameContainer, config)
    const firstFruit = game.fruits[0]
    const firstCard = game.cards[0]
    const secondFruit = game.fruits.find((fruit) => fruit !== firstFruit)
    const secondFruitIndex = game.fruits.indexOf(secondFruit)
    const secondCard = game.cards[secondFruitIndex]

    game.flip(firstCard)
    game.flip(secondCard)

    expect(game.currentMatch).toHaveLength(2)

    const newLength = new Promise((resolve) => {
      setTimeout(() => {
        resolve(game.currentMatch.length)
      }, config.timeOut * 2)
    })

    await expect(newLength).resolves.toEqual(0)
  })
})
