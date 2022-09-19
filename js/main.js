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
    [0, 0, 0, 0, 0, 0, 0, 0, 0]];

  let pieces = ['MJd1-.svg.png', 'MJd2-.svg.png', 'MJd3-.svg.png', 'MJf1-.svg.png', 'MJf2-.svg.png']

  let pieceWidth = document.getElementById('game').offsetWidth / layout[0].length;
  let pieceHeight = document.getElementById('game').offsetHeight / layout.length;

  shuffleArray(pieces);

  let curPiece = 0;

  layout.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      let piece = document.createElement('div');
      if (square === 1) {
        console.log();
        piece.className = 'taken-place'

        piece.innerHTML = '<img src="img/Pieces/' + pieces[Math.floor(curPiece)] + '" alt="Mahjong piece">'
        curPiece += 0.5;

        //TO-DO check if the piece was already deleted
        piece.addEventListener('click', () => {
          if (selected.length === 0) {
            selected.push(piece)
            selected[0].className = 'selected'
          } else {
            if (selected[0].innerHTML === piece.innerHTML && selected[0] !== piece) {
              selected[0].className = 'empty-place'
              selected[0].innerHTML = ''
              piece.className = 'empty-place'
              piece.innerHTML = ''
              selected = []
            }
          }
        })
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

function newGame() {
  document.getElementById('game').innerHTML = '';
  createGame();
}
