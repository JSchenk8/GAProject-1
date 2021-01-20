//! Global Variables 
// * Difficulty Variables
const difficultyDropDown = document.querySelector('#difficulties')
let difficulty = 'easy'
document.getElementById('displayHighScore').innerHTML = `${localStorage.getItem('easyHighScore')}`


difficultyDropDown.addEventListener('change', (event) => {
  if (event.target.value === 'easy') {
    document.getElementById('displayHighScore').innerHTML = `${localStorage.getItem('easyHighScore')}`
  } else if (event.target.value === 'medium') {
    document.getElementById('displayHighScore').innerHTML = `${localStorage.getItem('mediumHighScore')}`
  } else {
    document.getElementById('displayHighScore').innerHTML = `${localStorage.getItem('hardHighScore')}`
  }
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


// * Flag Counter
const flagCounterDisplay = document.getElementById('flagsLeft')
flagCounterDisplay.innerHTML = numFlags

// * Number of revealed Squares
let revealedSquares = 0


// * Reset Buttons
const resetButton = document.getElementById('playAgain')


// * Timer Variables
let timerId = 0
let time = 0
const timer = document.getElementById('timer')
timer.innerHTML = time

// * Winner Modal
const winnerModal = document.getElementById('winnerModal')
const winningTime = document.getElementById('winningTime')

// * Loser Modal
const loserModal = document.getElementById('loserModal')

// * High Score Variable

const highScore = [100000]






// ! Game Creation
let clickCounter = 0
playGame()

// ! Flag Click

flagCheck()

// ! MOBILE FLAG CLICK EVENT TO ADD
// mobileFlagCheck()

// ! Reset Button

resetButton.addEventListener('click', () => {
  reset()
})




//! Rules Modal

const modal = document.getElementById('rulesModal')
const rulesButton = document.getElementById('theRules')
const closeRulesModal = document.getElementById('close')

rulesButton.addEventListener('click', () => {
  modal.style.display = 'block'
})

closeRulesModal.addEventListener('click', () => {
  modal.style.display = 'none'
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
            } else if (!(cell.classList.contains('flag'))) {
              revealEmpty(cell)
            }
          } else {
            assignBombs(Number(cell.id))
            assignNumbersOrEmpties()
            clickCounter++
            revealEmpty(cell)
            startTimer()
          }
        } else {
          stopTimer()
          winner()
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
      let bombCount = 0
      for (let i = 0; i < cellsToCheckArray.length; i++) {
        if (document.getElementById(`${cellsToCheckArray[i]}`).classList.contains('bomb')) {
          bombCount++
        }
      }
      if (bombCount === 0) {
        document.getElementById(`${index}`).classList.add('empty')
      } else {
        if (difficulty === 'easy') {
          document.getElementById(`${index}`).classList.add('centeredNumberEasy')
        }
        if (difficulty === 'hard') {
          document.getElementById(`${index}`).classList.add('numberHard')
        }
        document.getElementById(`${index}`).classList.add('number')
        document.getElementById(`${index}`).setAttribute('bombCount', `${bombCount}`)
        if (bombCount === 1) {
          document.getElementById(`${index}`).classList.add('one')
        } else if (bombCount === 2) {
          document.getElementById(`${index}`).classList.add('two')
        } else if (bombCount === 3) {
          document.getElementById(`${index}`).classList.add('three')
        } else if (bombCount === 4) {
          document.getElementById(`${index}`).classList.add('four')
        } else if (bombCount === 5) {
          document.getElementById(`${index}`).classList.add('five')
        } else if (bombCount === 6) {
          document.getElementById(`${index}`).classList.add('six')
        }
      }
    }
}


//! Game Over function

function gameOver() {
  loserModal.style.display = 'block'
  const loserResetButton = document.getElementById('loserPlayAgain')
  loserResetButton.addEventListener('click', () => {
    reset()
  })
  stopTimer()
  const bombsArray = document.querySelectorAll('.bomb')
  bombsArray.forEach(cell => {
    cell.classList.add('bombOn')
  })
}

// ! Winner Function

function winner() {

  winnerModal.style.display = 'block'
  winningTime.innerHTML = time
  highScore.push(time)
  if (highScore[0] < highScore[1]) {
    highScore.pop()
  } else {
    highScore[0] = highScore[1]
    highScore.pop()
  }
  if (localStorage) {
    if (difficulty === 'easy') {
      localStorage.setItem('easyHighScore', highScore[0])
    } else if (difficulty === 'medium') {
      localStorage.setItem('mediumHighScore', highScore[0])
    } else {
      localStorage.setItem('hardHighScore', highScore[0])
    }
  }
  if (difficulty === 'easy') {
    document.getElementById('displayHighScore').innerHTML = `${localStorage.getItem('easyHighScore')}`
  } else if (difficulty === 'medium') {
    document.getElementById('displayHighScore').innerHTML = `${localStorage.getItem('mediumHighScore')}`
  } else {
    document.getElementById('displayHighScore').innerHTML = `${localStorage.getItem('hardHighScore')}`
  }
  
  const winnerResetButton = document.getElementById('winnerPlayAgain')
  winnerResetButton.addEventListener('click', () => {
    reset()
  })

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

// ! ------------- Mobile Flag Clicker Attempt 1?

// function mobileFlagCheck() {
//   cells.forEach(cell => {
//     cell.addEventListener('dblclick', (event) => {

//       console.log('double click')

//       console.log(cell)

//       if (cell.classList.contains('flag')) {
//         cell.classList.remove('flag')
//         cell.setAttribute('display', 'off')
//         numFlags++
//       } else if (numFlags === 0) {
//         alert('You are out of flags!')
//       } else if (cell.getAttribute('display') === 'off') {
//         cell.classList.add('flag')
//         cell.setAttribute('display', 'on')
//         numFlags--
//       } else {
//         return
//       }
//       flagCounterDisplay.innerHTML = numFlags
//     })
//   })
// }


// ! Timer

function startTimer() {
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


function reset() {
  removeGrid(cells)
  if (winnerModal.style.display === 'block') {
    winnerModal.style.display = 'none'
  }
  if (loserModal.style.display === 'block') {
    loserModal.style.display = 'none'
  }
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

function difficultyReset() {
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
    // grid.style.width = `${width * 50}px`
    // grid.style.height = `${height * 50}px`
    grid.style.width = '40vw'
    grid.style.height = '31.11vw'
    createGrid()
  } else if (difficulty === 'hard') {
    width = 24
    height = 20
    numBombs = 99
    grid.style.width = '40vw'
    grid.style.height = '33.33vw'
    createGrid()
  } else {
    width = 10
    height = 10
    numBombs = 10
    // grid.style.width = `${width * 50}px`
    // grid.style.height = `${height * 50}px`
    grid.style.width = '30vw'
    grid.style.height = '30vw'
    createGrid()
  }


  return numBombs
}