window.onload = () => createGame()


document.getElementById('new-game').addEventListener('click', newGame)


let selected = []


let layouts = [// flower
  [[0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0], [1, 1, 1, 0, 0, 0, 1, 1, 1], [0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0]], // pyramid
  [[0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 1, 2, 3, 2, 1, 0, 0], [1, 1, 2, 3, 4, 3, 2, 1, 1], [0, 0, 1, 2, 3, 2, 1, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0]], // snake
  [[1, 2, 0, 1, 1, 2, 1, 1, 0], [1, 2, 0, 1, 2, 3, 2, 1, 0], [1, 3, 0, 1, 1, 4, 4, 1, 0], [1, 2, 0, 0, 0, 0, 3, 0, 0], [3, 2, 0, 0, 0, 1, 2, 3, 0], [0, 2, 0, 0, 0, 2, 0, 0, 0], [0, 2, 3, 0, 4, 3, 0, 0, 0], [0, 0, 3, 0, 4, 0, 0, 0, 0], [0, 0, 3, 3, 4, 0, 0, 0, 0]]];

let layoutNumber = Math.floor(Math.random() * layouts.length)
let chosenLayout = layouts[layoutNumber].map(x => x)

document.getElementById('flower').addEventListener('click', () => {
  changeLayout(0)
})
document.getElementById('pyramid').addEventListener('click', () => {
  changeLayout(1)
})

document.getElementById('snake').addEventListener('click', () => {
  changeLayout(2);
})

function changeLayout(layoutNr) {
  layoutNumber = layoutNr
  chosenLayout = layouts[layoutNumber].map(x => x)
  newGame()
}

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createGame() {

  let pieces = ['MJd1-.svg.png', 'MJd2-.svg.png', 'MJd3-.svg.png', 'MJf1-.svg.png', 'MJf2-.svg.png', 'MJf3-.svg.png', 'MJf4-.svg.png', 'MJh1-.svg.png', 'MJh2-.svg.png', 'MJh3-.svg.png', 'MJh4-.svg.png', 'MJh5-.svg.png', 'MJh6-.svg.png', 'MJh7-.svg.png', 'MJh8-.svg.png', 'MJs1-.svg.png', 'MJs2-.svg.png', 'MJs3-.svg.png', 'MJs4-.svg.png', 'MJs5-.svg.png', 'MJs6-.svg.png', 'MJs7-.svg.png', 'MJs8-.svg.png', 'MJs9-.svg.png', 'MJt1-.svg.png', 'MJt2-.svg.png', 'MJt3-.svg.png', 'MJt4-.svg.png', 'MJt5-.svg.png', 'MJt6-.svg.png', 'MJt7-.svg.png', 'MJt8-.svg.png', 'MJt9-.svg.png', 'MJw1-.svg.png', 'MJw2-.svg.png', 'MJw3-.svg.png', 'MJw4-.svg.png', 'MJw5-.svg.png', 'MJw6-.svg.png', 'MJw7-.svg.png', 'MJw8-.svg.png', 'MJw9-.svg.png']

  document.getElementById('dropdown-menu').children[0].children[layoutNumber].className += ' is-active'

  let pieceWidth = document.getElementById('game').offsetHeight / 1.2 / chosenLayout[0].length;
  let pieceHeight = document.getElementById('game').offsetHeight / chosenLayout.length;

  shuffleArray(pieces);

  let curPiece = 0;

  let grid = document.getElementById('game')

  let hasPieces = true
  while (hasPieces) {
    hasPieces = false
    for (let rowIndex = 0; rowIndex < chosenLayout.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < chosenLayout[rowIndex].length; columnIndex++) {
        let piece = document.createElement('div');
        if (chosenLayout[rowIndex][columnIndex] !== 0) {
          hasPieces = true
          piece.className = 'piece'

          piece.innerHTML = '<img src="img/Pieces/' + pieces[Math.floor(curPiece)] + '" alt="Mahjong piece">'
          curPiece += 0.5;
          piece.addEventListener('click', () => selectPieces(piece))
          chosenLayout[rowIndex][columnIndex]--;
        }
        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        piece.style.left = `${rowIndex * pieceWidth}px`;
        // piece.style.left = `${rowIndex * pieceWidth - square*5}px`;
        piece.style.top = `${columnIndex * pieceHeight}px`;
        // piece.style.top = `${columnIndex * pieceHeight + square * 10}px`;
        grid.children[rowIndex].children[columnIndex].appendChild(piece);
      }
    }
  }
}

function selectPieces(piece) {

  if (selected.length === 0) {  // Highlight selected piece
    selected.push(piece)
    selected[0].className = 'selected'
  } else if (selected[0] === piece) { // Deselect the currently chosen piece
    selected = []
    piece.className = 'piece'
  } else if (selected[0].innerHTML === piece.innerHTML) { // Remove selected pieces if they're of the same type
    selected[0].remove()
    piece.remove()

    selected = []
  }
}

function newGame() {
  const grid = document.getElementById('game')
  for (const row of grid.children) {
    for (const col of row.children) {
      col.innerHTML = ''
    }
  }

  for (let child of document.getElementById('dropdown-menu').children[0].children) {
    child.className = child.className.replaceAll(' is-active', '')
  }

  createGame();
}
