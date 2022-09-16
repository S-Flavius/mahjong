createGame()

document.getElementById('new-game').addEventListener('click', newGame)

let selected = []

function createGame() {
  let layout = [
    [0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  let pieceWidth = document.getElementById('game').offsetWidth / layout[0].length;
  let pieceHeight = document.getElementById('game').offsetHeight / layout.length;

  layout.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      let piece = document.createElement('div');
      if (square === 1) {
        piece.className = 'black-piece'
        piece.addEventListener('click', () => {

          if (selected.length === 0) {
            selected.push(piece)
          } else {
            if (selected[0].id === piece.id && selected[0] !== piece) {
              selected[0].className = 'white-piece'
              piece.className = 'white-piece'
              selected = []
            }

          }

        })
      } else {
        piece.className = 'white-piece'
      }
      piece.style.width = `${pieceWidth}px`;
      piece.style.height = `${pieceHeight}px`;
      piece.style.left = `${rowIndex * pieceWidth}px`;
      piece.style.top = `${squareIndex * pieceHeight}px`;
      document.getElementById('game').appendChild(piece);
    });
  });
}

function newGame() {
  document.getElementById('game').innerHTML = '';
  createGame();
}
