//! Grid Creation
// * Get grid
const grid = document.querySelector('.grid')
// * Specify Width and Height in cells
const width = 18
const height = 14
// * Set Grid Height and Width in px
grid.style.width = `${width * 50}px`
grid.style.height = `${height * 50}px`
// * Array of the cells
const cells = []

// * Create the grid
for (let i = 0; i < width * height; i ++) {
  // ? Generate each element
  const cell = document.createElement('div')
  cell.classList.add('cell')
  cells.id = i
  grid.appendChild(cell)
  cells.push(cell)
  // ? Display cell index
  cell.innerHTML = i
  // ? Set the width and height of cells
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / height}%`
}