/**
 * Shuffles an array
 * @param {Array} initialArray - The array to shuffle
 * @returns {Array} A new array
 */
function shuffle(initialArray) {
  const array = [...initialArray]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export { shuffle }
