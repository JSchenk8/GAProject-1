//! Global Variables 
// * Difficulty Variables
const difficultyDropDown = document.querySelector('#difficulties')
let difficulty = 'easy'

difficultyDropDown.addEventListener('change', (event) => {
  
  difficultyReset()
  difficulty = event.target.value
  console.log(difficulty)
  numBombs = changeableGrid()
  reset()

})

// * Get grid
const grid = document.querySelector('.grid')
let cells = []

// * Specify Width and Height in cells, number of bombs and number of flags dependant on difficulty
let width = 0
let height = 0
let numBombs = 0
let winningNumber = 0
// * The First load counter
let firstLoad = 0
while (firstLoad === 0) {
  numBombs = changeableGrid()
  firstLoad++
  winningNumber = (width * height) - numBombs - 1
}

// * Assign the number of Flags
let numFlags = numBombs

console.log(winningNumber)

// * Flag Counter
const flagCounterDisplay = document.getElementById('flagsLeft')
console.log(flagCounterDisplay)
flagCounterDisplay.innerHTML = numFlags

// * Number of revealed Squares
let revealedSquares = 0


// * Reset Button
const resetButton = document.getElementById('playAgain')

// * Timer Variables
let timerId = 0
let time = 0
const timer = document.getElementById('timer')
timer.innerHTML = time



// ! Game Creation
let clickCounter = 0
playGame()

// ! Flag Click

flagCheck()

// ! Reset Button

resetButton.addEventListener('click', () => {
  reset()
})



// ? THE FUNCTIONS ARE BELOW

//! Grid Creation button:
function createGrid() {
  for (let i = 0; i < width * height; i++) {
    // grid.style.width = ''
    // grid.style.height = ''
    // ? Generate each element
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.setAttribute('display', 'off')
    cell.setAttribute('checked', 'false')
    cell.id = `${i}`
    grid.appendChild(cell)
    cells.push(cell)
    // ? Display cell index
    // cell.innerHTML = i
    // ? Set the width and height of cells
    cell.style.width = `${100 / width}%`
    cell.style.height = `${100 / height}%`
    
  }
}

function removeGrid(cells) {
  for (let i = 0; i < width * height; i++) {
    // ? Generate each element
    cells[i].remove()
  }
}

// ! Play Game Function

function playGame() {
  if (clickCounter === 0) {
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if (revealedSquares < winningNumber) {
          if (clickCounter !== 0) {
            //! Dig function goes here! 
            console.log('you clicked')
            if (cell.classList.contains('bomb')) {
              gameOver()
            } else if (cell.classList.contains('number') && !(cell.classList.contains('flag'))) {
              revealNumber(cell)
              console.log(cell)
              console.log(`No. Revealed Squares: ${revealedSquares}`)
            } else if (!(cell.classList.contains('flag'))) {
              revealEmpty(cell)
              console.log(cell)
              console.log(`No. Revealed Squares: ${revealedSquares}`)
            }
          } else {
            assignBombs(Number(cell.id))
            assignNumbersOrEmpties()
            clickCounter++
            console.log(clickCounter)
            revealEmpty(cell)
            startTimer()
          }
        } else {
          alert(`You won! Your time was: ${time}`)
          stopTimer()
          
        }
  
  
      })
  
    })
  }
}


// ! Bomb Creation Function
function assignBombs(firstClickNumber) {
  const bombArray = []
  const noBombCells = cellsToCheck(firstClickNumber)
  while (bombArray.length < numBombs) {
    const randomNumber = Math.floor(Math.random() * (width * height))
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
  } else if (cellClicked === (cells.length - (width))) {
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
      console.log(`cellstoCheckArray: ${cellsToCheckArray}`)
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
        document.getElementById(`${index}`).setAttribute('bombCount', `${bombCount}`)
      }
    }
}


//! Game Over function

function gameOver() {
  alert('Game Over')
  stopTimer()
}


//! Reveal Number function

function revealNumber(cell) {
  cell.setAttribute('display', 'on')
  cell.classList.add('numberOn')
  cell.setAttribute('checked', 'true')
  revealedSquares++
  cell.innerHTML = cell.getAttribute('bombCount')
}


// ! Reveal Empty 

function revealEmpty(cell) {
  cell.setAttribute('display', 'on')
  cell.setAttribute('checked', 'true')
  cell.classList.add('emptyOn')
  revealedSquares++
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




//! Flag Check Function 
function flagCheck() {
  cells.forEach(cell => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      console.log('right click')
  
      console.log(cell)
  
      if (cell.classList.contains('flag')) {
        cell.classList.remove('flag')
        cell.setAttribute('display', 'off')
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
}

// ! Timer

function startTimer () {
  time = 0
  timerId = 0
  timerId = setInterval(() => {
    time++
    timer.innerHTML = time
  }, 1000)
}

function stopTimer() {
  clearInterval(timerId)
}

// ! Reset Function


function reset () {
  removeGrid(cells)
  clickCounter = 0
  revealedSquares = 0
  numFlags = numBombs
  flagCounterDisplay.innerHTML = numFlags
  cells = []
  time = 0
  timer.innerHTML = time
  createGrid()
  playGame()
  flagCheck()
  stopTimer()
  console.log('We Reset')
  winningNumber = (width * height) - numBombs - 1
}

function difficultyReset () {
  removeGrid(cells)
  clickCounter = 0
  revealedSquares = 0
  numFlags = numBombs
  flagCounterDisplay.innerHTML = numFlags
  cells = []
  time = 0
  timer.innerHTML = time
  //createGrid()
  playGame()
  flagCheck()
  stopTimer()
  console.log('We Reset')
}

// ! Function Changeable Grid

function changeableGrid() {
  if (difficulty === 'medium') {
    width = 18
    height = 14
    numBombs = 40
    grid.style.width = `${width * 50}px`
    grid.style.height = `${height * 50}px`
    createGrid()
  } else if (difficulty === 'hard') {
    width = 24
    height = 20
    numBombs = 99
    grid.style.width = '900px'
    grid.style.height = '700px'
    createGrid()
  } else {
    width = 10
    height = 10
    numBombs = 10
    grid.style.width = `${width * 50}px`
    grid.style.height = `${height * 50}px`
    createGrid()
  }
  
  
  return numBombs
}