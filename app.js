'use strict'

const game = document.createElement('div');
game.classList = 'game';

let array = 
[
  1, 2, 3, 4,
  5, 6, 7, 8,
  9, 10, 11, 12,
  13, 14, 15, 0
];


let moves = 0;

let seconds = 0;
let minutes = 0;
let timer;

let arrayOnWin = array.map(a => a);

const swap = (i1, i2) => {
  var t = array[i1];
  array[i1] = array[i2];
  array[i2] = t;
}

const isSolvable = (a) => {
  for (var kDisorder = 0, i = 1, len = a.length-1; i < len; i++){
    for (var j = i-1; j >= 0; j--){
      if (a[j] > a[i]){
        kDisorder++;
      }
    }
  }
  return !(kDisorder % 2);
}

const randomizeArray = () => {
  array.sort(() => Math.random() - 0.5);
  if (!isSolvable(array)){
    swap(0, 1);
  }
}

randomizeArray();

const createCell = (n, i) => {
  const cell = document.createElement('div');
  cell.dataset.id = n;
  cell.dataset.index = i;
  cell.textContent = n !== 0 ? n : '';
  game.innerHTML += cell.outerHTML;
}

const upMoves = () => {
  moves++;
  if (moves === 1) {
    changeTime();
    timer = setInterval(changeTime, 1000);
  }
  document.querySelector('.moves-view').textContent = moves;
}

const resetTimer = () => {
  clearInterval(timer)
  seconds = -1;
  minutes = 0; 
  changeTime()
}

const renderCells = () => {
  game.innerHTML = '';
  array.forEach( (n, i) => createCell(n, i));
  if (array.reduce((a, b) => b + a.toString()) ===
      arrayOnWin.reduce((a, b) => b + a.toString())) {
    alert('You Won!')
    resetTimer();
  }
}

const changeTime = () => {
  if (seconds<59) {
    seconds++
  } else {
    minutes++;
    seconds = 0;
  }
  document.querySelector('.timer').innerHTML = `
    ${minutes<10 ? '0'+minutes : minutes}:${seconds<10? '0'+seconds: seconds}
  `
}



const gameInit = () => {
  document.body.appendChild(game);
  renderCells();
  
}

const moveTo = (i, z) => {
  [array[i], array[z]] = [array[z], array[i]];
  upMoves();
  renderCells();
}


gameInit();

const clickTapHandler = e => {
  const t = e.target,
    id = e.target.dataset.id,
    i = +e.target.dataset.index,
    zerroIndex = array.indexOf(0);

  if (i !== zerroIndex) {
    if (i - 4 === zerroIndex) moveTo(i, zerroIndex);
    if (i + 1 === zerroIndex 
        && i !== 3
        && i !== 7
        && i !== 11) moveTo(i, zerroIndex);
    if (i + 4 === zerroIndex) moveTo(i, zerroIndex);
    if (i - 1 === zerroIndex 
        && i !== 4
        && i !== 8
        && i !== 12) moveTo(i, zerroIndex);
  }
}

game.addEventListener('click', clickTapHandler);
game.addEventListener('touchend', clickTapHandler);



const gameControls = document.createElement('div');
gameControls.classList = 'game-controls'
gameControls.innerHTML = `
  <button class="retry"></button>
  <span class="moves-counter">
    moves:<span class="moves-view"> ${moves}</span>
  </span>
  <span class="timer">
    ${minutes<10 ? '0'+minutes : minutes}:${seconds<10? '0'+seconds: seconds}
  </span>
`;
document.body.appendChild(gameControls);

gameControls.addEventListener('click', e => {
  const t = e.target;
  if (t.classList.contains('retry')) {
    randomizeArray();
    setTimeout(renderCells(), 0);
    moves = -1;
    upMoves();
    resetTimer();
  }
})