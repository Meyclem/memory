import { shuffle } from "./utils"
import * as games from "./api/games"

/**
 * Function used to generate the score table in the menu.
 * @param {Array} scores The games' scores obtained through a call to the server
 * on `GET /games`
 */

function generateScoreTable(scores) {
  const tableContainer = document.createElement("div")
  tableContainer.setAttribute("id", "scores")
  const table = document.createElement("table")

  const titles = ["Player", "Result", "Time", "Attempts"]

  const headers = (() => {
    const titleRow = document.createElement("tr")
    titles.forEach((title) => {
      const th = document.createElement("th")
      th.innerText = title
      titleRow.appendChild(th)
    })
    return titleRow
  })()

  const tHead = document.createElement("thead")
  tHead.appendChild(headers)
  table.appendChild(tHead)

  const tBody = document.createElement("tbody")
  scores
    .map(({ player, isWon, timeTaken, attempts }) => ({
      player,
      attempts,
      isWon: isWon ? "✅" : "❌",
      timeTaken: `${timeTaken} s`,
    }))
    .forEach((score) => {
      const tr = document.createElement("tr")
      const dataKeys = ["player", "isWon", "timeTaken", "attempts"]
      dataKeys.forEach((key) => {
        const td = document.createElement("td")
        td.innerText = score[key]
        tr.appendChild(td)
      })
      tBody.appendChild(tr)
    })
  table.appendChild(tBody)

  tableContainer.appendChild(table)
  return tableContainer
}

const availablefruits = [
  "red-apple",
  "banana",
  "orange",
  "lime",
  "pomegranate",
  "apricot",
  "lemon",
  "strawberry",
  "green-apple",
  "mandarin",
  "grape",
  "watermelon",
  "plum",
  "pear",
  "cherry",
  "raspberry",
  "mango",
  "yellow-cherry",
]
class Game {
  /**
   * Function used to generate the score table in the menu.
   * @constructor
   * @param gameContainer The html element the game will be generated in
   * @param gameConfig The base configuration for the game
   * @param gameConfig.gridSize The number of element displayed in the game's grid
   * @param gameConfig.timeOut The delay between actions during the game
   * (e.g: In case of no match between two images, the player won't be able to click during this time)
   * @param gameConfig.duration The game's maximum duration in seconds, displayed by the timer
   */
  constructor(gameContainer, gameConfig = {}) {
    this.config = {
      gridSize: 28,
      timeOut: 1000,
      duration: 180,
      ...gameConfig,
    }
    this.gameContainer = gameContainer
    this.initGame()
  }

  /**
   * Generate an empty '.grid' element and stores it in `this.grid`
   */
  generateGrid() {
    const grid = document.createElement("div")
    grid.classList.add("grid")
    return grid
  }

  createCards() {
    // Generate one card for each fruit
    const cards = this.fruits.map(this.createCard)
    cards.forEach((card, i) => {
      card.addEventListener("click", () => this.flip(card, i))
    })
    return cards
  }

  createCard() {
    const card = document.createElement("div")
    card.classList.add("card")
    card.classList.add("not-revealed")
    return card
  }

  /**
   * This function is call at the game initialisation and displays:
   * - an input where the player can inputs its name
   *
   */
  async displayMenu() {
    // Creates the HTML '#menu' element
    const menu = document.createElement("div")
    menu.setAttribute("id", "menu")

    // Calls the server and creates the scores' table
    const data = await games.get()
    const scoresTable = generateScoreTable(data)

    // Creates the name input and its label
    const nameInput = document.createElement("input")
    nameInput.placeholder = "e.g: Jane Rambo"
    nameInput.setAttribute("id", "name")
    const nameLabel = document.createElement("label")
    nameLabel.htmlFor = "name"
    nameLabel.innerText = "What's your name?"

    // Creates the start button and attach an event listener to start the game on click
    const startBtn = document.createElement("button")
    startBtn.innerText = "Start game"
    startBtn.classList.add("game-button")
    startBtn.addEventListener("click", () => {
      this.gameContainer.innerHTML = ""
      this.startGame(nameInput.value)
    })
    nameInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        startBtn.click()
      }
    })

    // Add the input group and the button to the menu
    menu.appendChild(nameLabel)
    menu.appendChild(nameInput)
    menu.appendChild(startBtn)

    // Replace the game container content with the menu and the scores table
    this.gameContainer.innerHTML = ""
    this.gameContainer.appendChild(menu)
    this.gameContainer.appendChild(scoresTable)
    nameInput.focus()
  }

  /**
   * This Function initialize the game at is starting state:
   * - new array of fruits
   * - new set of cards based on fruits
   * - resets the current found cards
   * - resets the successful matches
   * - creates a new timer
   */
  initGame() {
    this.fruits = this.getRandomFruits()
    this.cards = this.createCards()
    this.grid = this.generateGrid()
    this.cards.forEach((card) => this.grid.appendChild(card))
    this.currentMatch = []
    this.successfulMatches = 0
    this.displayMenu()
  }

  /**
   * Gets a subset of fruits for the game and double them to have two of each fruits
   * @returns {Array} Random selected fruits
   */
  getRandomFruits() {
    const randomFruits = shuffle(availablefruits).slice(0, this.config.gridSize / 2)
    return shuffle([...randomFruits, ...randomFruits])
  }

  /**
   * Used to create the timer displayed on the screen, depending on the config's duration
   * @returns {HTMLElement} the HTML timer element so it can be added to the DOM by the caller function.
   */
  createTimer() {
    // Creates the HTML element
    const timerContainer = document.createElement("div")
    timerContainer.setAttribute("id", "timer-container")
    const timer = document.createElement("div")
    timer.setAttribute("id", "timer")
    // Dynamically add an animation with the right duration
    timer.style.animation = `progress ${this.config.duration}s linear forwards`

    timerContainer.appendChild(timer)

    return timerContainer
  }

  /**
   * The function used to really start the game.
   * Several actions here:
   * - add the generated grid inside the game container
   * - restores game settings to default
   * - starts the timer and stores it in `this.currentGame` so it can be stopped in `finishGame`
   * @param {string} playerName - The name of the player
   */
  startGame(playerName) {
    this.player = playerName !== "" ? playerName : "Unknown player"
    this.gameContainer.appendChild(this.grid)
    this.grid.appendChild(this.createTimer())
    this.attempts = 0
    this.startTime = new Date()
    this.currentGame = setTimeout(() => {
      this.finishGame(false)
    }, this.config.duration * 1000)
  }

  /**
   * Function added to each card during the `initGame` function
   * @param {HTMLElement} selectedCard - The card clicked by the player
   * @param {number} index - The index of the corresponding fruit in `this.fruits`
   */
  flip(selectedCard, index) {
    // The player's choice is stored in memory
    this.currentMatch.push({ selectedCard, index })

    // Change the CSS classes to reveal the card
    selectedCard.classList.remove("not-revealed")
    selectedCard.classList.add("revealed")

    // The timeout is a lilltle trick to avoid the image display before the end of the flip animation
    setTimeout(() => {
      selectedCard.classList.add("fruit")
      selectedCard.classList.add(this.fruits[index])
      this.check()
    }, 300)
  }

  /**
   * Check if the player found a match between two images
   */
  check() {
    if (this.currentMatch.length === 2) {
      // If there are 2 matches, if is a new attempt from the player so we increment it
      this.attempts += 1

      // Froze the game for a short time to avoid new action
      this.grid.classList.add("frozen")

      // Check if the two selected fruits are the same
      const match = this.fruits[this.currentMatch[0].index] === this.fruits[this.currentMatch[1].index]
      if (!match) {
        // If it's not, hide the cards again...
        setTimeout(() => {
          this.unflip(this.currentMatch[0])
          this.unflip(this.currentMatch[1])
          this.currentMatch = []
          // ... and allow the player to click again
          this.grid.classList.remove("frozen")
        }, this.config.timeOut)
      } else {
        // If the fruits are the same, it's a success
        this.currentMatch = []
        this.grid.classList.remove("frozen")
        this.successfulMatches += 1
        if (this.isGameWon()) {
          this.finishGame(true)
        }
      }
    }
  }

  /**
   * This function hides a card again
   * @param {Object} playerChoice - One of the two non- matching cards the player clicked on
   * @param {HTMLElement} playerChoice.selectedCard - The HTML card element
   * @param {number} playerChoice.index - The corresponding fruit's index in `this.fruits`
   */
  unflip({ selectedCard, index }) {
    selectedCard.classList.remove("revealed")
    selectedCard.classList.add("not-revealed")
    selectedCard.classList.remove("fruit")
    selectedCard.classList.remove(this.fruits[index])
  }

  /**
   * Check if the number of successes stored in memory is enough to win the game
   */
  isGameWon() {
    return this.successfulMatches === this.config.gridSize / 2
  }

  /**
   * Function used to end the game:
   * - Stops the timer
   * - Calls the API to store the game
   * - Displays the results to the player
   * @param {boolean} isWon - `true` if the game is won, `false` otherwise
   */
  async finishGame(isWon) {
    // Stops the timer and compute the duration of the game
    this.endTime = new Date()
    this.gameLength = this.endTime - this.startTime
    const timeTaken = Math.floor(this.gameLength / 1000)

    // Removes the game and prepare the menu
    this.gameContainer.innerHTML = ""
    const menu = document.createElement("div")
    menu.setAttribute("id", "menu")
    const sentance = document.createElement("h2")
    if (isWon) {
      sentance.innerText = `CONGRATULATION ${this.player}\nYOU WON!`
    } else {
      sentance.innerText = "YOU LOST!"
    }

    const results = document.createElement("p")
    results.innerText = `You finished in ${timeTaken} seconds and ${this.attempts} attempts!`

    // Sends the game's data to the server
    await games.post({
      player: this.player,
      timeTaken,
      isWon,
      attempts: this.attempts,
    })

    // Calls the server again to get all the games' data and use it to display the scores table again
    const data = await games.get()
    const scoresTable = generateScoreTable(data)

    // Creates a "Play again" button
    const resetGameBtn = document.createElement("button")
    resetGameBtn.innerText = "New Game"
    resetGameBtn.classList.add("game-button")
    clearTimeout(this.currentGame)
    resetGameBtn.addEventListener("click", () => this.initGame())

    // Adds all the created elements to the game container
    menu.appendChild(sentance)
    menu.appendChild(results)
    menu.appendChild(resetGameBtn)
    this.gameContainer.appendChild(menu)
    this.gameContainer.appendChild(scoresTable)
  }
}

export { Game }
