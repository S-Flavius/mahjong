window.onload = () => createGame()


document.getElementById('new-game').addEventListener('click', newGame)

let selected = []


// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let layouts = [
  // flower
  [
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0]
  ],
  // pyramid
  [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 2, 1, 1, 0, 0],
    [0, 0, 1, 2, 3, 2, 1, 0, 0],
    [1, 1, 2, 3, 4, 3, 2, 1, 1],
    [0, 0, 1, 2, 3, 2, 1, 0, 0],
    [0, 0, 1, 1, 2, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0]
  ],
  // snake
  [
    [1, 2, 0, 1, 1, 2, 1, 1, 0],
    [1, 2, 0, 1, 2, 3, 2, 1, 0],
    [1, 3, 0, 1, 1, 4, 4, 1, 0],
    [1, 2, 0, 0, 0, 0, 3, 0, 0],
    [3, 2, 0, 0, 0, 1, 2, 3, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 3, 0, 4, 3, 0, 0, 0],
    [0, 0, 3, 0, 4, 0, 0, 0, 0],
    [0, 0, 3, 3, 4, 0, 0, 0, 0]
  ]
];


function createGame() {

  let pieces = ['MJd1-.svg.png', 'MJd2-.svg.png', 'MJd3-.svg.png', 'MJf1-.svg.png', 'MJf2-.svg.png', 'MJf3-.svg.png', 'MJf4-.svg.png', 'MJh1-.svg.png', 'MJh2-.svg.png', 'MJh3-.svg.png', 'MJh4-.svg.png', 'MJh5-.svg.png', 'MJh6-.svg.png', 'MJh7-.svg.png', 'MJh8-.svg.png', 'MJs1-.svg.png', 'MJs2-.svg.png', 'MJs3-.svg.png', 'MJs4-.svg.png', 'MJs5-.svg.png', 'MJs6-.svg.png', 'MJs7-.svg.png', 'MJs8-.svg.png', 'MJs9-.svg.png', 'MJt1-.svg.png', 'MJt2-.svg.png', 'MJt3-.svg.png', 'MJt4-.svg.png', 'MJt5-.svg.png', 'MJt6-.svg.png', 'MJt7-.svg.png', 'MJt8-.svg.png', 'MJt9-.svg.png', 'MJw1-.svg.png', 'MJw2-.svg.png', 'MJw3-.svg.png', 'MJw4-.svg.png', 'MJw5-.svg.png', 'MJw6-.svg.png', 'MJw7-.svg.png', 'MJw8-.svg.png', 'MJw9-.svg.png']

  let layoutNumber = Math.floor(Math.random() * layouts.length)
  let chosenLayout = layouts[layoutNumber]

  document.getElementById('dropdown-menu').children[0].children[layoutNumber].className += ' is-active'

  let pieceWidth = document.getElementById('game').offsetWidth / chosenLayout[0].length;
  let pieceHeight = document.getElementById('game').offsetHeight / chosenLayout.length;

  shuffleArray(pieces);

  let curPiece = 0;

  chosenLayout.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      let piece = document.createElement('div');
      if (square === 1) {
        console.log();
        piece.className = 'taken-place'

        piece.innerHTML = '<img src="img/Pieces/' + pieces[Math.floor(curPiece)] + '" alt="Mahjong piece">'
        curPiece += 0.5;
        piece.addEventListener('click', () => selectPieces(piece))
      } else {
        piece.className = 'empty-place'
      }
      piece.style.width = `${pieceWidth}px`;
      piece.style.height = `${pieceHeight}px`;
      piece.style.left = `${rowIndex * pieceWidth}px`;
      piece.style.top = `${squareIndex * pieceHeight}px`;
      document.getElementById('game').appendChild(piece);
    });
  });
}

function selectPieces(piece) {

  // Don't select empty spaces
  if (piece.className !== 'empty-place') {
    if (selected.length === 0) {  //  Highlight selected piece
      selected.push(piece)
      selected[0].className = 'selected'
    } else if (selected[0].innerHTML === piece.innerHTML && selected[0] !== piece) { // Remove selected pieces if they're of the same type
      selected[0].className = 'empty-place'
      piece.className = 'empty-place'

      selected[0].innerHTML = ''
      piece.innerHTML = ''

      selected = []
    }
  }
}

function newGame() {
  document.getElementById('game').innerHTML = '';
  createGame();
}
