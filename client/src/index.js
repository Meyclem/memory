import "../styles/scss/_index.scss"
import { checkApiStatus } from "./utils"
import { Game } from "./game"

function createHTMLElement({ target, content, elementType = "div", classes = "" }) {
  const element = document.createElement(elementType)
  element.innerHTML = content
  if (classes !== "") {
    element.classList.add(classes)
  }
  target.appendChild(element)
  return element
}

/**
 * Adds the error message in the game element in case of error when calling the API
 * @param {Object} error - The error that occured
 */
function createError({ message }) {
  createHTMLElement({
    target: document.getElementById("game"),
    content: message,
    elementType: "h2",
    classes: "error-message",
  })
}

checkApiStatus()
  .then(() => {
    new Game(document.getElementById("game"))
  })
  .catch(createError)
