window.onload = () => createGame();

document.getElementById('new-game').addEventListener('click', newGame);

let selected = [];
let lastMove = [];
let availableMoves = [];
let totalHints = 5;
let currentHints = totalHints;

let hintButton = document.getElementById('hint');
hintButton.innerText = `Hint (${currentHints}/${totalHints})`;

let layouts = [// flower
  [[0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0],
   [1, 1, 1, 0, 0, 0, 1, 1, 1], [0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0],
   [0, 0, 0, 1, 1, 1, 0, 0, 0]],

  // pyramid
  [[0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 1, 2, 3, 2, 1, 0, 0],
   [1, 1, 2, 3, 4, 3, 2, 1, 1], [0, 0, 1, 2, 3, 2, 1, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0],
   [0, 0, 0, 0, 1, 0, 0, 0, 0]],

  // snake
  [[1, 2, 0, 1, 1, 2, 1, 1, 0], [1, 2, 0, 1, 2, 3, 2, 1, 0], [1, 3, 0, 1, 1, 4, 4, 1, 0], [1, 2, 0, 0, 0, 0, 3, 0, 0],
   [3, 2, 0, 0, 0, 1, 2, 3, 0], [0, 2, 0, 0, 0, 2, 0, 0, 0], [0, 2, 3, 0, 4, 3, 0, 0, 0], [0, 0, 3, 0, 4, 0, 0, 0, 0],
   [0, 0, 3, 3, 4, 0, 0, 0, 0]]];


let layoutNumber = 0;
let chosenLayout = 0;
let chosenManually = false;

document.getElementById('flower').addEventListener('click', () => {
  changeLayout(0);
});
document.getElementById('pyramid').addEventListener('click', () => {
  changeLayout(1);
});
document.getElementById('snake').addEventListener('click', () => {
  changeLayout(2);
});

document.getElementById('undo').addEventListener('click', () => {
  if (selected.length !== 0) {
    selected[0].className = 'piece';
    selected = [];
  }
  lastMove[0].hidden = false;
  lastMove[1].hidden = false;
  checkAvailableMoves();
});

document.getElementById('hint').addEventListener('click', () => {
  hintButton.innerText = `Hint (${--currentHints}/${totalHints})`;

  let hints = [];
  for (let piece of availableMoves) {
    if (piece.hidden) continue;
    for (let piece1 of availableMoves) {
      if (piece1.hidden || piece === piece1) continue;
      if (piece.innerHTML === piece1.innerHTML) {
        hints.push([piece, piece1]);
      }
    }
  }

  let chosenHint = hints[Math.floor(Math.random() * hints.length)];

  hintButton.disabled = true;
  chosenHint[0].className += ' hint';
  chosenHint[1].className += ' hint';

  setTimeout(() => {
    for (const piece of document.getElementsByClassName('piece')) {
      piece.className = piece.className.replace(' hint', '');
    }
    if (currentHints > 0) hintButton.disabled = false;
  }, 1500);
});

document.getElementById('reshuffle').addEventListener('click', () => {
  if (selected.length !== 0) {
    selected[0].className = 'piece';
    selected = [];
  }

  //  https://stackoverflow.com/a/64457744/15403179
  let pieces = document.querySelectorAll('.piece:not([hidden])');


  for (let i = 0; i < pieces.length; i++) {
    let piece1 = pieces[i];

    //piece2 could be piece1. In that case, nothing changes
    let piece2 = pieces[Math.floor(Math.random() * pieces.length)];

    [piece1.style.cssText, piece2.style.cssText, piece1.id, piece2.id] = [piece2.style.cssText, piece1.style.cssText,
                                                                          piece2.id, piece1.id];
  }
  checkAvailableMoves();
});

function changeLayout(layoutNr) {
  document.getElementById('dropdown-menu').style.display = 'none';
  layoutNumber = layoutNr;
  chosenManually = true;

  newGame();
}

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateGrid() {
  const grid = document.getElementById('game');
  for (let i = 0; i < layouts[layoutNumber].length; i++) {
    const row = document.createElement('div');
    row.className = 'tile is-ancestor';
    for (let j = 0; j < layouts[layoutNumber][i].length; j++) {
      const col = document.createElement('div');
      col.className = 'tile is-parent';
      row.appendChild(col);
    }
    grid.appendChild(row);
  }
}

function generatePiece(colIndex, rowIndex, pieces, curPiece, pieceWidth, pieceHeight) {
  let piecesOnPosition = chosenLayout[colIndex][rowIndex];
  let piece = document.createElement('div');
  piece.className = 'piece';
  piece.id = 'row: ' + rowIndex + ', col: ' + colIndex;
  // noinspection HtmlRequiredAltAttribute
  piece.innerHTML = `<img style='position: absolute' src='img/Pieces/svg/basePiece.svg'><img style='position:absolute;' src='img/Pieces/svg/${pieces[Math.floor(
    curPiece)]}'>`;
  piece.addEventListener('click', () => selectPieces(piece));
  piece.style.zIndex = chosenLayout.length * 100 - (rowIndex * 100) + colIndex * 10 + piecesOnPosition;
  chosenLayout[colIndex][rowIndex]--;
  piece.style.width = `${pieceWidth}px`;
  piece.style.height = `${pieceHeight}px`;
  piece.style.left = `${colIndex * (0.77 * pieceWidth) - (piecesOnPosition - 1) * 9}px`;
  piece.style.top = `${rowIndex * 0.84 * pieceHeight + (piecesOnPosition - 1) * 7}px`;
  document.getElementById('game').children[colIndex].children[rowIndex].appendChild(piece);
}

function checkAvailableMoves() {
  availableMoves = [];
  let pieces = document.getElementsByClassName('piece');

  for (let piece of pieces) {
    let neighbourLeft, neighbourRight, maxHeight = piece.style.zIndex;

    for (const piece1 of pieces) {
      if (piece.hidden || piece1.hidden) continue;
      if (piece1 === piece) continue;

      let [rowLocationPiece, rowLocationPiece1] = [piece.id.indexOf('row: '), piece1.id.indexOf('row: ')];
      let [colLocationPiece, colLocationPiece1] = [piece.id.indexOf('col: '), piece1.id.indexOf('col: ')];
      let [commaLocationPiece, commaLocationPiece1] = [piece.id.indexOf(','), piece1.id.indexOf(',')];

      let [rowPiece, rowPiece1] = [Number.parseInt(piece.id.substring(rowLocationPiece + 5, commaLocationPiece)),
                                   Number.parseInt(piece1.id.substring(rowLocationPiece1 + 5, commaLocationPiece1))];
      let [colPiece, colPiece1] = [Number.parseInt(piece.id.substring(colLocationPiece + 5)),
                                   Number.parseInt(piece1.id.substring(colLocationPiece1 + 5))];

      let heightPiece = piece.style.zIndex % 10;
      let heightPiece1 = piece1.style.zIndex % 10;

      if (rowPiece === rowPiece1 && heightPiece === heightPiece1) {
        if (colPiece === colPiece1 - 1) {
          neighbourLeft = true;
        } else if (colPiece === colPiece1 + 1) {
          neighbourRight = true;
        }
      }
      if (rowPiece === rowPiece1 && colPiece === colPiece1 && heightPiece < heightPiece1) {
        maxHeight = Math.max(maxHeight, heightPiece1);
      }
    }
    if (neighbourLeft && neighbourRight) continue;
    if (piece.style.zIndex !== maxHeight) continue;
    availableMoves.push(piece);
  }
}

function createGame() {

  generateGrid();

  chosenLayout = JSON.parse(JSON.stringify(layouts[layoutNumber]));

  let pieces = ['bamboo1.svg', 'bamboo1.svg', 'bamboo1.svg', 'bamboo1.svg', 'bamboo2.svg', 'bamboo2.svg', 'bamboo2.svg',
                'bamboo2.svg', 'bamboo3.svg', 'bamboo3.svg', 'bamboo3.svg', 'bamboo3.svg', 'bamboo4.svg', 'bamboo4.svg',
                'bamboo4.svg', 'bamboo4.svg', 'bamboo5.svg', 'bamboo5.svg', 'bamboo5.svg', 'bamboo5.svg', 'bamboo6.svg',
                'bamboo6.svg', 'bamboo6.svg', 'bamboo6.svg', 'bamboo7.svg', 'bamboo7.svg', 'bamboo7.svg', 'bamboo7.svg',
                'bamboo8.svg', 'bamboo8.svg', 'bamboo8.svg', 'bamboo8.svg', 'bamboo9.svg', 'bamboo9.svg', 'bamboo9.svg',
                'bamboo9.svg', 'char1.svg', 'char1.svg', 'char1.svg', 'char1.svg', 'char2.svg', 'char2.svg',
                'char2.svg', 'char2.svg', 'char3.svg', 'char3.svg', 'char3.svg', 'char3.svg', 'char4.svg', 'char4.svg',
                'char4.svg', 'char4.svg', 'char5.svg', 'char5.svg', 'char5.svg', 'char5.svg', 'char6.svg', 'char6.svg',
                'char6.svg', 'char6.svg', 'char7.svg', 'char7.svg', 'char7.svg', 'char7.svg', 'char8.svg', 'char8.svg',
                'char8.svg', 'char8.svg', 'char9.svg', 'char9.svg', 'char9.svg', 'char9.svg', 'dot1.svg', 'dot1.svg',
                'dot1.svg', 'dot1.svg', 'dot2.svg', 'dot2.svg', 'dot2.svg', 'dot2.svg', 'dot3.svg', 'dot3.svg',
                'dot3.svg', 'dot3.svg', 'dot4.svg', 'dot4.svg', 'dot4.svg', 'dot4.svg', 'dot5.svg', 'dot5.svg',
                'dot5.svg', 'dot5.svg', 'dot6.svg', 'dot6.svg', 'dot6.svg', 'dot6.svg', 'dot7.svg', 'dot7.svg',
                'dot7.svg', 'dot7.svg', 'dot8.svg', 'dot8.svg', 'dot8.svg', 'dot8.svg', 'dot9.svg', 'dot9.svg',
                'dot9.svg', 'dot9.svg', 'fBamboo.svg', 'fChrysanthemum.svg', 'fOrchid.svg', 'fPlum.svg', 'gDrag.svg',
                'gDrag.svg', 'gDrag.svg', 'gDrag.svg', 'rDrag.svg', 'rDrag.svg', 'rDrag.svg', 'rDrag.svg', 'wDrag.svg',
                'wDrag.svg', 'wDrag.svg', 'wDrag.svg', 'seasAutumn.svg', 'seasSpring.svg', 'seasSummer.svg',
                'seasWinter.svg', 'windE.svg', 'windE.svg', 'windE.svg', 'windE.svg', 'windN.svg', 'windN.svg',
                'windN.svg', 'windN.svg', 'windS.svg', 'windS.svg', 'windS.svg', 'windS.svg', 'windW.svg', 'windW.svg',
                'windW.svg', 'windW.svg'];

  document.getElementById('dropdown-menu').children[0].children[layoutNumber].className += ' is-active';

  let pieceWidth = document.getElementById('game').offsetHeight / 1.2 / chosenLayout[0].length;
  let pieceHeight = document.getElementById('game').offsetHeight / chosenLayout.length;

  shuffleArray(pieces);

  let curPiece = 0;

  let hasPieces = true;
  while (hasPieces) {
    hasPieces = false;
    for (let colIndex = 0; colIndex < chosenLayout.length; colIndex++) {
      for (let rowIndex = 0; rowIndex < chosenLayout[colIndex].length; rowIndex++) {
        if (chosenLayout[colIndex][rowIndex] === 0) continue;
        hasPieces = true;
        if (Math.random() >= 0.5) continue;
        generatePiece(colIndex, rowIndex, pieces, curPiece, pieceWidth, pieceHeight);
        curPiece += 0.5;
      }
    }
  }

  if (!isGameWinnable()) newGame();
  chosenManually = false;

  checkAvailableMoves();
}

function isGameWinnable() {
  let allPieces = document.getElementsByClassName('piece');
  checkAvailableMoves();

  for (let i = 0; i < allPieces.length / 2; i++) {
    checkAvailableMoves();
    for (const piece of availableMoves) {
      for (const piece1 of availableMoves) {
        if (piece === piece1) continue;
        if (piece.innerHTML === piece1.innerHTML) {
          piece.hidden = true;
          piece1.hidden = true;
        }
      }
      if (Array.from(allPieces).filter(piece => !piece.hidden).length === 0) {
        for (let piece of allPieces) piece.hidden = false;
        return true;
      }
    }
  }

  if (Array.from(allPieces).filter(piece => !piece.hidden).length !== 0) return false;
  for (let piece of allPieces) piece.hidden = false;
  return true;
}

function checkGameState() {
  if (document.getElementsByClassName('piece').length === 2) {
    setTimeout(() => {
      alert('You won!');
    }, 100);
  } else {
    let winnable = false;
    for (let piece of availableMoves) {
      if (piece.hidden) continue;
      for (let piece1 of availableMoves) {
        if (piece1.hidden || piece === piece1) continue;
        if (piece.innerHTML === piece1.innerHTML) {
          winnable = true;
        }
      }
    }
    if (!winnable) {
      setTimeout(() => {
        alert('You lost!');
      }, 100);
    }
  }
}

function selectPieces(piece) {
  if (!availableMoves.includes(piece)) return;
  if (selected.length === 0) {  // Highlight selected piece
    selected.push(piece);
    selected[0].className = 'selected';
  } else if (selected[0] === piece) { // Deselect the currently chosen piece
    selected = [];
    piece.className = 'piece';
  } else if (selected[0].innerHTML !== piece.innerHTML) { // If the pieces are not the same, select the new one
    selected[0].className = 'piece';
    piece.className = 'selected';
    selected[0] = piece;
  } else {
    // Remove selected pieces if they're of the same type && the move is legal
    // Completely delete the pieces after the 2nd move if they are still hidden
    if (lastMove.length === 2) {
      for (const piece of lastMove) {
        if (piece.hidden) {
          piece.remove();
        }
      }
    }

    // Save the last move for the undo button
    lastMove = [selected[0], piece];

    // Make sure the pieces won't still be selected after undo
    selected[0].className = 'piece';
    piece.className = 'piece';
    selected[0].hidden = true;
    piece.hidden = true;

    selected = [];
    checkAvailableMoves();
  }

  checkGameState();
}

function newGame() {

  if (!chosenManually) {
    layoutNumber = Math.floor(Math.random() * layouts.length);
  }


  const grid = document.getElementById('game');
  for (const row of grid.children) {
    for (const col of row.children) {
      col.innerHTML = '';
    }
  }

  currentHints = totalHints;
  hintButton.innerText = `Hint (${currentHints}/${totalHints})`;

  for (let child of document.getElementById('dropdown-menu').children[0].children) {
    child.className = child.className.replaceAll(' is-active', '');
  }


  createGame();
}
