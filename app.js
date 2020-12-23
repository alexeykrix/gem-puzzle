'use strict'


class GemPuzzle {
  constructor (selector='body', name='game-container') {
    this.selector = selector
    this.name = name
    this.game = document.createElement('div')
    this.game.classList = 'game'
    this.gameContainer = document.createElement('div')
    this.gameContainer.classList = this.name
    this.array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]
    this.moves = 0
    this.seconds = 0
    this.minutes = 0
    this.timer
    this.arrayOnWin = this.array.map(a => a)
    this.gameControls = document.createElement('div')
    this.gameControls.classList = 'game-controls'
    this.gameControls.innerHTML = `
      <button class="retry"></button>
      <span class="moves-counter">
        moves: <span class="moves-view"> ${this.moves}</span>
      </span>
      <span class="timer">00 : 00</span>
    `
  }
  swap(i1, i2) {
    let t = this.array[i1]
    this.array[i1] = this.array[i2]
    this.array[i2] = t
  }
  isSolvable(a) {
    let kDisorder = 0
    for (let kDisorder = 0, i = 1, len = a.length-1; i < len; i++){
      for (let j = i-1; j >= 0; j--){
        if (a[j] > a[i]){
          kDisorder++
        }
      }
    }
    return !(kDisorder % 2)
  }
  randomizeArray() {
    this.array.sort(() => Math.random() - 0.5)
    if (!this.isSolvable(this.array)){
      this.swap(0, 1)
    }
  }
  createCell(n, i) {
    const cell = document.createElement('div')
    cell.dataset.id = n
    cell.dataset.index = i
    cell.textContent = n !== 0 ? n : ''
    this.game.innerHTML += cell.outerHTML
  }
  upMoves() {
    this.moves++
    if (this.moves === 1) {
      this.changeTime()
      this.timer = setInterval(this.changeTime, 1000)
    }
    this.gameContainer.querySelector('.moves-view').textContent = this.moves
  }
  resetTimer() {
    this.clearInterval(this.timer)
    this.seconds = -1
    this.minutes = 0 
    this.changeTime()
  }
  renderCells() {
    this.game.innerHTML = ''
    this.array.forEach( (n, i) => this.createCell(n, i))
    if (this.array.reduce((a, b) => b + a.toString()) ===
        this.arrayOnWin.reduce((a, b) => b + a.toString())) {
      alert('You Won!')
      this.resetTimer()
    }
  }
  changeTime = () => {
    if (this.seconds<59) {
      this.seconds++
    } else {
      this.minutes++
      this.seconds = 0
    }
    this.gameControls.querySelector('.timer').innerHTML = `
      ${(this.minutes<10 ? '0'+this.minutes : this.minutes)||'00'}
      :
      ${(this.seconds<10? '0'+this.seconds: this.seconds)||'00'}
    `
  }
  gameInit() {
    this.randomizeArray()
    this.gameContainer.appendChild(this.game)
    document.querySelector(this.selector).appendChild(this.gameContainer)
    this.renderCells()
  }
  moveTo(i, z) {
    [this.array[i], this.array[z]] = [this.array[z], this.array[i]]
    this.upMoves()
    this.renderCells()
  }
  clickTapHandler = e => {
    const i = +e.target.dataset.index,
      zerroIndex = this.array.indexOf(0)
  
    if (i !== zerroIndex) {
      if (i - 4 === zerroIndex) this.moveTo(i, zerroIndex)
      if (i + 1 === zerroIndex 
          && i !== 3
          && i !== 7
          && i !== 11) this.moveTo(i, zerroIndex)
      if (i + 4 === zerroIndex) this.moveTo(i, zerroIndex)
      if (i - 1 === zerroIndex 
          && i !== 4
          && i !== 8
          && i !== 12) this.moveTo(i, zerroIndex)
    }
  }
  start() {
    this.gameInit()

    this.game.addEventListener('click', this.clickTapHandler)
    this.game.addEventListener('touchend', this.clickTapHandler)
    
    this.gameContainer.appendChild(this.gameControls)
    this.gameControls.addEventListener('click', e => {
      const t = e.target
      if (t.classList.contains('retry')) {
        this.randomizeArray()
        setTimeout(this.renderCells(), 0)
        this.moves = -1
        this.upMoves()
        this.resetTimer()
      }
    })
  }
}

new GemPuzzle().start()