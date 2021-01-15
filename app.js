//! Grid Creation
// * Get grid
const grid = document.querySelector('.grid')
// * Specify Width and Height in cells, and number of bombs
const width = 18
const height = 14
const numBombs = 40
let numFlags = numBombs
// * Set Grid Height and Width in px
grid.style.width = `${width * 50}px`
grid.style.height = `${height * 50}px`
// * Array of the cells
const cells = []
console.log(cells)
// * Create the grid
for (let i = 0; i < width * height; i++) {
  // ? Generate each element
  const cell = document.createElement('div')
  cell.classList.add('cell')
  cell.setAttribute('display', 'off')
  cell.setAttribute('checked', 'false')
  cell.id = `${i}`
  grid.appendChild(cell)
  cells.push(cell)
  // ? Display cell index
  cell.innerHTML = i
  // ? Set the width and height of cells
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / height}%`

}
// * Flag Counter
const flagCounterDisplay = document.getElementById('flagsLeft')
console.log(flagCounterDisplay)
flagCounterDisplay.innerHTML = numFlags



// ! Game Creation
let clickCounter = 0
if (clickCounter === 0) {
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (clickCounter !== 0) {
        //! Dig function goes here! 
        console.log('you clicked')
        if (cell.classList.contains('bomb')) {
          gameOver()
        } else if (cell.classList.contains('number')) {
          revealNumber(cell)
          console.log(cell)
        } else {
          revealEmpty(cell)
          console.log(cell)
        }
      } else {
        assignBombs(Number(cell.id))
        assignNumbersOrEmpties()
        clickCounter++
        console.log(clickCounter)
      }
      
    })
    
  })
} 






// ! Flag Click

cells.forEach(cell => {
  cell.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    console.log('right click')

    console.log(cell)

    if (cell.classList.contains('flag')) {
      cell.classList.remove('flag')
      numFlags++
    } else if (numFlags === 0) {
      alert('You are out of flags!')
    } else if (cell.getAttribute('display') === 'off') {
      cell.classList.add('flag')
      cell.setAttribute('display', 'on')
      numFlags--
    } else {
      return
    }
    flagCounterDisplay.innerHTML = numFlags
  })
})


// ! Dig



// ? THE FUNCTIONS ARE BELOW


// ! Bomb Creation Function
function assignBombs(firstClickNumber) {
  const bombArray = []
  const noBombCells = cellsToCheck(firstClickNumber)
  while (bombArray.length < numBombs) {
    const randomNumber = Math.floor(Math.random() * 251) + 1
    if ((bombArray.indexOf(randomNumber) === -1) && (noBombCells.indexOf(randomNumber) === -1)) {
      bombArray.push(randomNumber)
    }
  }
  for (let i = 0; i < bombArray.length; i++) {
    document.getElementById(`${bombArray[i]}`).classList.add('bomb')
    document.getElementById(`${bombArray[i]}`).value = 'bombId'
  }
}


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
      //console.log(`cellstoCheckArray: ${cellsToCheckArray}`)
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


//! Game Over function

function gameOver() {
  alert('Game Over')
}


//! Reveal Number function

function revealNumber(cell) {
  cell.setAttribute('display', 'on')
  cell.classList.add('numberOn')
  cell.setAttribute('checked', 'true')
}


// ! Reveal Empty 

function revealEmpty(cell) {
  cell.setAttribute('display', 'on')
  cell.setAttribute('checked', 'true')
  cell.classList.add('emptyOn')
  const neighbourArray = cellsToCheck(Number(cell.id))
  for (let i = 1; i < neighbourArray.length; i++) {
    const newCell = document.getElementById(`${neighbourArray[i]}`)
    console.log('Checking cell now')
    console.log(`The index is ${i}`)
    if (newCell.getAttribute('checked') === 'true') {
      console.log('This cell has already been checked')
    } else if (newCell.classList.contains('number')) {
      revealNumber(newCell)
    } else if (newCell.classList.contains('empty')) {
      revealEmpty(newCell)
    }
  }
}