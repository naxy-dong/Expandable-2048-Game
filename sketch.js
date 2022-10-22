let canvasWidth = 600
let canvasHeight = 700
let grid;
let score = 0;
let gridSize;
let cellSize;
let scoreHeight = 96
let lineHeight = 85;
let row;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    
    newGame();
    updateGame() 
   
    console.log(grid)
  }

function newGame(){
  gridSize = 2
  grid = new Array(gridSize * gridSize).fill(0)
  cellSize = (canvasWidth - 8)/gridSize -0.2;
  addNumber()
  addNumber()
  
}

function drawGrid() {
  for(row = 0; row < gridSize; row++){
    for(col = 0; col < gridSize; col++) {
      strokeWeight(4);
      stroke(51);
      fill(150,200,250)
      rect(cellSize * col + 4, cellSize * row + scoreHeight, cellSize, cellSize, 20); 
      let index = row * gridSize + col
      
      if( grid[index] != 0){
        const msg = `${grid[index]}`;
        //const size = floor(map(sqrt(msg.length), 1, 3, 64, 14));
        const size = floor(map(sqrt(msg.length), 1, 3, cellSize, 14));
        drawText(grid[index], color(45,240,44), size ,cellSize * col + cellSize/2 + 4 ,cellSize * row + scoreHeight + cellSize/2)
      }
    }
  }
}

function keyPressed(){
  console.log(keyCode)
  switch(keyCode){
    case 40: //down
    case 38: //up
      verticalSlide(keyCode)
      
      updateGame()
      break
    case 37://left
    case 39: //right
      horizontalSlide(keyCode)
      updateGame()
      break
      
  }
}
function horizontalSlide(direction) {
	let past = [];
	arrayCopy(grid, past);
	for (let i = 0; i < gridSize; i++) {
		let row = grid.slice(i * gridSize, i * gridSize + gridSize);
		row = combine(row, direction);
		row = row.filter(x => x > 0);
		const z = new Array(gridSize - row.length).fill(0);
		row = direction === LEFT_ARROW ? row.concat(z) : z.concat(row);
		grid.splice(i * gridSize, gridSize);
		grid.splice(i * gridSize, 0, ...row);
	}
	checkSlide(past);
}

function somethingMoved(past) {
	return !(grid.every((x, i) => x === past[i]));
}
  
function checkSlide(past) {
	if (somethingMoved(past)) {
		addNumber();
	}
	if (!movesLeft()) {
      gameOver = true;
      gridSize = gridSize + 1
      cellSize = canvasWidth/gridSize - 10;
	}
}
  
function movesLeft() {
	// check neighbors
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const current = grid[row * gridSize + col];
			if (current === 0) {
				// grid still has empty spots
				return true;
			}
			// last column doesnt have a right neighbor
			const right = (col < gridSize - 1) ? grid[row * gridSize + col + 1] : 0;
			// last row doesnt have a bottom neighbor
			const bottom = (row < gridSize - 1) ? grid[(row + 1) * gridSize + col] : 0;
			if (current === right || current === bottom) {
				return true;
			}
		}
	}
	return false;
}
function verticalSlide(direction) {
	let past = [];
	arrayCopy(grid, past);
	for (let c = 0; c < gridSize; c++) {
		let column = getVerticalCol(c);
		column = combine(column, direction);
		column = column.filter(x => x > 0);
		const z = new Array(gridSize - column.length).fill(0);
		column = direction === UP_ARROW ? column.concat(z) : z.concat(column);
		setVerticalCol(column, c);
	}
	checkSlide(past);
}

  function setVerticalCol(column, c) {
	for (let i = 0; i < column.length; i++) {
		const val = column[i];
		const idx = i * gridSize + c;
		grid[idx] = val;
	}
}
function getVerticalCol(C){
  let result = []
  for(let i = 0; i < gridSize; i ++){
    let val  =grid[i * gridSize + C]
    result.push(val)
    
  }
  return result
}

function combine(row,direction){
  switch (direction) {
		case DOWN_ARROW:
		case RIGHT_ARROW:
			return combineDownRight(row);
		case UP_ARROW:
		case LEFT_ARROW:
			return combineUpLeft(row);
  }
	}
function combineUpLeft(row) {
	const forStart = 0;
	return combineRow(row, forStart, (i, x) => i < x - 1, i => i + 1);
}

function combineDownRight(row) {
	const forStart = row.length - 1;
	return combineRow(row, forStart, (i, x) => i > 0, i => i - 1);
}

function combineRow(row, forStart, forCond, forIncr) {
	for (let i = forStart; forCond(i, row.length); i = forIncr(i)) {
		const a = row[i];
		let idx = forIncr(i);
		let b = row[idx];
		while (b === 0 && forCond(idx, row.length)) {
			idx = forIncr(idx);
			b = row[idx];
		}
		if (a === b && a !== 0) {
			row[i] = a + b;
			score += row[i];
			row[idx] = 0;
			if (row[i] === 2048) {
				completed = true;
			}
		}
	}
	return row;
}


function drawScore(){
  stroke(4)
  line(cellSize * row,lineHeight,10,lineHeight)
  noStroke()
  drawText(`Score: ${score}`,color(149, 0, 255), 40, gridSize * cellSize/2, 67)
}
function drawText(message, color, size, x, y){
  textAlign(CENTER,CENTER)
  textSize(size)
  fill(color)
  text(message,x,y)
  
}
  
function addNumber(){
  let options = []
  for(let i = 0; i < grid.length; i++){

    
    if(grid[i] == 0){
      options.push(i)
      
      
    }
  }
  console.log(options)
  let randomNumber = floor(random(options.length))
  console.log(randomNumber)
  
  
let  newRandomNum=random(1) 
let result;
result = newRandomNum < 0.5 ? 2 : 4;

  let randomIndex = options[randomNumber]
  grid[randomIndex] = result
}
  
function updateGame(){
  background(220)
  drawScore()
  drawGrid()
  
}
  

