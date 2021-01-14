//! Grid Creation
// * Get grid
const grid = document.querySelector('.grid')
// * Specify Width and Height in cells, and number of bombs
const width = 18
const height = 14
const numBombs = 40
// * Set Grid Height and Width in px
grid.style.width = `${width * 50}px`
grid.style.height = `${height * 50}px`
// * Array of the cells
const cells = []

// * Create the grid
for (let i = 0; i < width * height; i++) {
  // ? Generate each element
  const cell = document.createElement('div')
  cell.classList.add('cell')
  cell.id = `${i}`
  grid.appendChild(cell)
  cells.push(cell)
  // ? Display cell index
  cell.innerHTML = i
  // ? Set the width and height of cells
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / height}%`
}

// ! Game Creation

// ? This will run on the condition of a first click, this variable can be added later, along with the event listener for click

// ! Bomb Creation Function
function assignBombs(firstClickNumber) {
  const bombArray = []
  const noBombCells = cellsToCheck(firstClickNumber)
  console.log(noBombCells)
  // ! This array above contains all the cells which random numbers CANNOT be
  while (bombArray.length < numBombs) {
    const randomNumber = Math.floor(Math.random() * 251) + 1
    if ((bombArray.indexOf(randomNumber) === -1) && (bombArray.indexOf(firstClickNumber) === -1)) { // ! Here we need to check it not against 'firstclickNumber', but against each value of 'noBombCells'
      bombArray.push(randomNumber)
    }
  }
  console.log(bombArray)
  for (let i = 0; i < bombArray.length; i++) {
    document.getElementById(`${bombArray[i]}`).classList.add('bomb')
  }
}
// * This runs a random grid, will never have a bomb on 8
assignBombs(8)

// ! Run the assign numbers for every cell that does not contain a bomb


// ! Function to check which cells to check, REQUIRED INPUT 'cellClicked'
function cellsToCheck(cellClicked) {
  if (cellClicked === 0) {
    return [cellClicked, cellClicked + 1, cellClicked + width, cellClicked + width + 1]
  } else if (cellClicked === (width - 1)) {
    return [cellClicked, cellClicked - 1, cellClicked + width, cellClicked + width - 1]
  } else if (cellClicked === (cells.length - (width - 1))) {
    return [cellClicked, cellClicked + 1, cellClicked - width, cellClicked - width + 1]
  } else if (cellClicked === cells.length - 1) {
    return [cellClicked, cellClicked - 1, cellClicked - width, cellClicked - width - 1]
  } else if (cellClicked < width) {
    return [cellClicked, cellClicked - 1, cellClicked + 1, cellClicked + width, cellClicked + width - 1, cellClicked + width + 1]
  } else if (cellClicked % width === (width - 1)) {
    return [cellClicked, cellClicked - 1, cellClicked - width, cellClicked + width, cellClicked - width - 1, cellClicked + width - 1]
  } else if (cellClicked + width >= width * height) {
    return [cellClicked, cellClicked - 1, cellClicked + 1, cellClicked - width, cellClicked - width - 1, cellClicked - width + 1]
  } else if (cellClicked % width === 0) {
    return [cellClicked, cellClicked + 1, cellClicked - width, cellClicked + width, cellClicked - width + 1, cellClicked + width + 1]
  } else {
    return [cellClicked, cellClicked + 1, cellClicked - 1, cellClicked + width, cellClicked - width, cellClicked - width - 1, cellClicked - width + 1, cellClicked + width - 1, cellClicked + width + 1]
  }
}

// ! Function to assign Numbers or Empties

function assignNumbersOrEmpties() {
  for (let index = 0; index < cells.length; index++)
    if (!document.getElementById(`${index}`).classList.contains('bomb')) {
      const cellsToCheckArray = cellsToCheck(index)
      
      let bombCount = 0
      for (let i = 0; i < cellsToCheckArray.length; i++) {
        if (document.getElementById(`${cellsToCheckArray[i]}`).classList.contains('bomb')) {
          bombCount++
        }
      }
      if (bombCount === 0) {
        document.getElementById(`${index}`).classList.add('empty')
      } else {
        document.getElementById(`${index}`).classList.add('number')
        document.getElementById(`${index}`).innerHTML = bombCount
      }
    } 
}

assignNumbersOrEmpties()