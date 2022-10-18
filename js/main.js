import bulmaAccordion
  from '../node_modules/@creativebulma/bulma-collapsible/src/js/index.js';

const accordions = bulmaAccordion.attach(); // accordions now contains an array
                                            // of all Accordion instances

window.onload = () => {
  changeDifficulty(difficultyKey);
  changeLayout('Flower');

  if (window.innerHeight < 800) {
    document.getElementsByClassName('navbar')[0].style.display = 'none';

    setTimeout(() => {
      window.scroll({
                      top: 10, behavior: 'smooth',
                    });
    }, 200);
  }
};

document.getElementById('new-game').addEventListener('click', newGame);

let selected = [];
let lastMove = [];
let availableMoves = [];
let totalHints;
let currentHints = totalHints;
let totalReshuffles;
let currentReshuffles = totalReshuffles;
let totalUndos;
let currentUndos = totalUndos;

let hintButton = document.getElementById('hint');
hintButton.innerHTML = ``;

let reshuffleButton = document.getElementById('reshuffle');
reshuffleButton.innerHTML = ``;

let undoButton = document.getElementById('undo');
undoButton.innerHTML = ``;
undoButton.disabled = true;

let layouts = {
  'Flower'                                  : [
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0]], 'Pyramid' : [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 2, 1, 1, 0, 0],
    [0, 0, 1, 2, 3, 2, 1, 0, 0],
    [1, 1, 2, 3, 4, 3, 2, 1, 1],
    [0, 0, 1, 2, 3, 2, 1, 0, 0],
    [0, 0, 1, 1, 2, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0]], 'Snake'   : [
    [1, 2, 0, 1, 1, 2, 1, 1, 0],
    [1, 2, 0, 1, 2, 3, 2, 1, 0],
    [1, 3, 0, 1, 1, 4, 4, 1, 0],
    [1, 2, 0, 0, 0, 0, 3, 0, 0],
    [3, 2, 0, 0, 0, 1, 2, 3, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 3, 0, 4, 3, 0, 0, 0],
    [0, 0, 3, 0, 4, 0, 0, 0, 0],
    [0, 0, 3, 3, 4, 0, 0, 0, 0]], 'Stairs'  : [
    [1, 1, 1, 2, 2, 2],
    [1, 1, 1, 2, 2, 2],
    [2, 2, 2, 3, 3, 3],
    [2, 2, 2, 3, 3, 3],
    [3, 3, 3, 4, 4, 4],
    [3, 3, 3, 4, 4, 4],
    [4, 4, 4, 5, 5, 5],
    [4, 4, 4, 6, 6, 6],
    [5, 5, 5, 7, 7, 7],
    [5, 5, 5, 7, 7, 8]], 'Mouse'            : [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 1, 2, 3, 2, 1, 0, 0],
    [0, 1, 2, 3, 3, 3, 2, 1, 0],
    [0, 1, 2, 3, 4, 3, 2, 1, 0],
    [0, 1, 2, 3, 3, 3, 2, 1, 0],
    [0, 0, 1, 2, 3, 2, 1, 0, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0],
    [0, 0, 0, 1, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 1, 2, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0]], 'Tortoise': [
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 0, 1],
    [0, 1, 2, 3, 3, 3, 2, 1, 0],
    [0, 0, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1]], 'Test'    : [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 2, 2, 1, 0, 0],
    [0, 0, 1, 2, 2, 1, 0, 0],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [2, 2, 3, 4, 4, 3, 2, 2],
    [2, 2, 3, 4, 4, 3, 2, 2],
    [3, 3, 4, 5, 5, 4, 3, 3],
    [3, 3, 4, 5, 5, 4, 3, 3],
    [2, 2, 3, 4, 4, 3, 2, 2],
    [2, 2, 3, 4, 4, 3, 2, 2],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0, 0, 1, 2, 2, 1, 0, 0],
    [0, 0, 1, 2, 2, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0]],
};

let difficulties = {
  //difficulty : [Hints, reshuffles, undos]
  Easy      : {
    hints: 100, reshuffles: 100, undos: 100,
  }, Medium : {
    hints: 5, reshuffles: 1, undos: 1,
  }, Hard   : {
    hints: 3, reshuffles: 0, undos: 0,
  }, EXTREME: {
    hints: 0, reshuffles: 0, undos: 0,
  },
};

let layoutKey = 'Flower';
let chosenLayout = 0;
let difficultyKey = 'Easy';
let chosenManually = false;

for (let key in layouts) {
  let element = document.createElement('a');
  element.className = 'dropdown-item';
  element.id = key.toString();
  element.innerText = key.toString();
  element.addEventListener('click', () => changeLayout(key));
  document.getElementById('dropdown-menu').children[0].appendChild(element);
}

for (let key in difficulties) {
  let element = document.createElement('a');
  element.className = 'dropdown-item';
  element.id = key.toString();
  element.innerText = key.toString();
  element.addEventListener('click', () => changeDifficulty(key));
  document.getElementById('dropdown-menu2').children[0].appendChild(element);
}

document.getElementById('undo').addEventListener('click', () => {
  undoButton.innerHTML = `<img class='undo-button'><p>(${--currentUndos}/${totalUndos})</p>`;
  if (currentUndos <= 0) undoButton.disabled = true;
  if (selected.length !== 0) {
    selected[0].className = 'piece';
    selected = [];
  }
  lastMove[0].hidden = false;
  lastMove[1].hidden = false;
  checkAvailableMoves();
  undoButton.disabled = true;
});

document.getElementById('hint').addEventListener('click', () => {
  hintButton.innerHTML = `<img class='hint-button'/><p>(${--currentHints}/${totalHints})</p>`;

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

  let [hintDiv, hintDiv1] = [
    document.createElement('div'), document.createElement('div')];
  [hintDiv.className, hintDiv1.className] = ['hint', 'hint'];
  [hintDiv.style.left, hintDiv1.style.left] = [
    chosenHint[0].style.left, chosenHint[1].style.left];
  [hintDiv.style.top, hintDiv1.style.top] = [
    chosenHint[0].style.top, chosenHint[1].style.top];
  [hintDiv.style.zIndex, hintDiv1.style.zIndex] = [
    Number.parseInt(chosenHint[0].style.zIndex) + 1 + '',
    Number.parseInt(chosenHint[1].style.zIndex) + 1 + ''];

  document.getElementById('game').appendChild(hintDiv);
  document.getElementById('game').appendChild(hintDiv1);

  hintButton.disabled = true;

  setTimeout(() => {
    for (const piece of document.getElementsByClassName('piece')) {
      Array.from(document.getElementsByClassName('hint')).
            forEach(hint => hint.remove());
    }
    if (currentHints > 0) hintButton.disabled = false;
  }, 2500);
});

let curReshuffles = 0;
document.getElementById('reshuffle').
         addEventListener('click', function reshuffle() {
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

             [
               piece1.style.cssText,
               piece2.style.cssText,
               piece1.id,
               piece2.id] = [
               piece2.style.cssText,
               piece1.style.cssText,
               piece2.id,
               piece1.id];
           }
           checkAvailableMoves();

           let clickable = availableMoves.filter(piece => !piece.hidden);
           if (clickable.length < 2) {
             curReshuffles++;

             if (curReshuffles > 5) {
               alert('No more moves available. You lose!');
               newGame();
             }
             reshuffle();
           }
           curReshuffles = 0;

           reshuffleButton.innerHTML = `<img class='reshuffle-button'/><p>(${--currentReshuffles}/${totalReshuffles})</p>`;
           if (currentReshuffles <= 0) reshuffleButton.disabled = true;

         });

document.getElementById('auto-move').addEventListener('click', () => {
  let pairs = [];

  for (const piece of availableMoves) {
    for (const piece1 of availableMoves) {
      if (piece.hidden || piece1.hidden) continue;
      if (piece === piece1) continue;
      if (piece.innerHTML === piece1.innerHTML) {
        pairs.push([piece, piece1]);
      }
    }
  }

  for (const piece of pairs[Math.floor(Math.random() * pairs.length)]) {
    piece.click();
  }
});

// https://stackoverflow.com/a/48777893/15403179
let cursor = 0;
const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
  cursor = (e.keyCode == KONAMI_CODE[cursor]) ? cursor + 1 : 0;
  if (cursor == KONAMI_CODE.length) document.getElementById(
    'auto-move').disabled = false;
});

function changeLayout(key) {
  document.getElementById('dropdown-menu').style.display = 'none';
  layoutKey = key;
  chosenManually = true;

  let longestLine = 0;
  Array.from(layouts[key]).
        forEach((line) => longestLine = Math.max(longestLine, line.length));

  document.getElementById('game').style.height = `${(longestLine * 91 /
                                                     1.1)}px`; // Piece height
                                                               // is 90.6px
  document.getElementById('game').style.width = `${(layouts[key].length *
                                                    75.5)}px`; // Piece width
                                                               // is 75.5px

  newGame();
}

function changeDifficulty(key) {
  document.getElementById('dropdown-menu2').style.display = 'none';
  chosenManually = true;
  difficultyKey = key;

  newGame();
}

function calculateHelperValues() {
  hintButton.disabled = false;
  reshuffleButton.disabled = false;

  totalHints = difficulties[difficultyKey]['hints'];
  totalReshuffles = difficulties[difficultyKey]['reshuffles'];
  totalUndos = difficulties[difficultyKey]['undos'];

  currentHints = totalHints;
  currentReshuffles = totalReshuffles;
  currentUndos = totalUndos;

  hintButton.innerHTML = `<img class='hint-button'/><p>(${currentHints}/${totalHints})</p>`;
  reshuffleButton.innerHTML = `<img class='reshuffle-button'/><p>(${currentReshuffles}/${totalReshuffles})</p>`;
  undoButton.innerHTML = `<img class='undo-button'.><p>(${currentUndos}/${totalUndos})</p>`;

  if (totalHints <= 0) hintButton.disabled = true;
  if (totalReshuffles <= 0) reshuffleButton.disabled = true;
  if (totalUndos <= 0) undoButton.disabled = true;

  Array.from(document.getElementById('dropdown-menu2').children[0].children).
        forEach(e => {
          if (e.id == difficultyKey) e.className += ' is-active';
        });
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
  for (let i = 0; i < layouts[layoutKey].length; i++) {
    const row = document.createElement('div');
    row.className = 'tile is-ancestor';
    for (let j = 0; j < layouts[layoutKey][i].length; j++) {
      const col = document.createElement('div');
      col.className = 'tile is-parent';
      row.appendChild(col);
    }
    grid.appendChild(row);
  }
}

function generatePiece(colIndex, rowIndex, pieces, curPiece) {
  let piecesOnPosition = chosenLayout[colIndex][rowIndex];
  let piece = document.createElement('div');
  piece.className = 'piece';
  piece.id = 'row: ' + rowIndex + ', col: ' + colIndex;
  // noinspection HtmlRequiredAltAttribute
  piece.innerHTML = `<img class='basePiece' src='img/Pieces/svg/basePiece.svg'><img  class='pieceImage' src='img/Pieces/svg/${pieces[Math.floor(
    curPiece)]}'>`;
  piece.addEventListener('click', () => selectPieces(piece));
  piece.style.zIndex = chosenLayout.length * 100 - (rowIndex * 100) + colIndex *
                       10 + piecesOnPosition;
  chosenLayout[colIndex][rowIndex]--;
  piece.style.left = `${colIndex * 58.135 - (piecesOnPosition - 1) * 9 +
                        (chosenLayout.length / 10 * 75.5)}px`;
  piece.style.top = `${rowIndex * 76.104 + (piecesOnPosition - 1) * 7 + 15}px`;
  document.getElementById(
    'game').children[colIndex].children[rowIndex].appendChild(piece);
}

function checkAvailableMoves() {
  availableMoves = [];
  let pieces = document.getElementsByClassName('piece');

  for (let piece of pieces) {
    let neighbourLeft, neighbourRight, maxHeight = piece.style.zIndex;

    for (const piece1 of pieces) {
      if (piece.hidden || piece1.hidden) continue;
      if (piece1 === piece) continue;

      let [rowLocationPiece, rowLocationPiece1] = [
        piece.id.indexOf('row: '), piece1.id.indexOf('row: ')];
      let [colLocationPiece, colLocationPiece1] = [
        piece.id.indexOf('col: '), piece1.id.indexOf('col: ')];
      let [commaLocationPiece, commaLocationPiece1] = [
        piece.id.indexOf(','), piece1.id.indexOf(',')];

      let [rowPiece, rowPiece1] = [
        Number.parseInt(
          piece.id.substring(rowLocationPiece + 5, commaLocationPiece)),
        Number.parseInt(
          piece1.id.substring(rowLocationPiece1 + 5, commaLocationPiece1))];
      let [colPiece, colPiece1] = [
        Number.parseInt(piece.id.substring(colLocationPiece + 5)),
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
      if (rowPiece === rowPiece1 && colPiece === colPiece1 && heightPiece <
          heightPiece1) {
        maxHeight = Math.max(maxHeight, heightPiece1);
      }
    }
    if (neighbourLeft && neighbourRight || piece.style.zIndex !==
        maxHeight) continue;
    availableMoves.push(piece);
  }
}

async function createGame() {

  generateGrid();

  chosenLayout = JSON.parse(JSON.stringify(layouts[layoutKey]));

  let pieces = [
    'bamboo1.svg',
    'bamboo1.svg',
    'bamboo1.svg',
    'bamboo1.svg',
    'bamboo2.svg',
    'bamboo2.svg',
    'bamboo2.svg',
    'bamboo2.svg',
    'bamboo3.svg',
    'bamboo3.svg',
    'bamboo3.svg',
    'bamboo3.svg',
    'bamboo4.svg',
    'bamboo4.svg',
    'bamboo4.svg',
    'bamboo4.svg',
    'bamboo5.svg',
    'bamboo5.svg',
    'bamboo5.svg',
    'bamboo5.svg',
    'bamboo6.svg',
    'bamboo6.svg',
    'bamboo6.svg',
    'bamboo6.svg',
    'bamboo7.svg',
    'bamboo7.svg',
    'bamboo7.svg',
    'bamboo7.svg',
    'bamboo8.svg',
    'bamboo8.svg',
    'bamboo8.svg',
    'bamboo8.svg',
    'bamboo9.svg',
    'bamboo9.svg',
    'bamboo9.svg',
    'bamboo9.svg',
    'char1.svg',
    'char1.svg',
    'char1.svg',
    'char1.svg',
    'char2.svg',
    'char2.svg',
    'char2.svg',
    'char2.svg',
    'char3.svg',
    'char3.svg',
    'char3.svg',
    'char3.svg',
    'char4.svg',
    'char4.svg',
    'char4.svg',
    'char4.svg',
    'char5.svg',
    'char5.svg',
    'char5.svg',
    'char5.svg',
    'char6.svg',
    'char6.svg',
    'char6.svg',
    'char6.svg',
    'char7.svg',
    'char7.svg',
    'char7.svg',
    'char7.svg',
    'char8.svg',
    'char8.svg',
    'char8.svg',
    'char8.svg',
    'char9.svg',
    'char9.svg',
    'char9.svg',
    'char9.svg',
    'dot1.svg',
    'dot1.svg',
    'dot1.svg',
    'dot1.svg',
    'dot2.svg',
    'dot2.svg',
    'dot2.svg',
    'dot2.svg',
    'dot3.svg',
    'dot3.svg',
    'dot3.svg',
    'dot3.svg',
    'dot4.svg',
    'dot4.svg',
    'dot4.svg',
    'dot4.svg',
    'dot5.svg',
    'dot5.svg',
    'dot5.svg',
    'dot5.svg',
    'dot6.svg',
    'dot6.svg',
    'dot6.svg',
    'dot6.svg',
    'dot7.svg',
    'dot7.svg',
    'dot7.svg',
    'dot7.svg',
    'dot8.svg',
    'dot8.svg',
    'dot8.svg',
    'dot8.svg',
    'dot9.svg',
    'dot9.svg',
    'dot9.svg',
    'dot9.svg',
    'fBamboo.svg',
    'fChrysanthemum.svg',
    'fOrchid.svg',
    'fPlum.svg',
    'gDrag.svg',
    'gDrag.svg',
    'gDrag.svg',
    'gDrag.svg',
    'rDrag.svg',
    'rDrag.svg',
    'rDrag.svg',
    'rDrag.svg',
    'wDrag.svg',
    'wDrag.svg',
    'wDrag.svg',
    'wDrag.svg',
    'seasAutumn.svg',
    'seasSpring.svg',
    'seasSummer.svg',
    'seasWinter.svg',
    'windE.svg',
    'windE.svg',
    'windE.svg',
    'windE.svg',
    'windN.svg',
    'windN.svg',
    'windN.svg',
    'windN.svg',
    'windS.svg',
    'windS.svg',
    'windS.svg',
    'windS.svg',
    'windW.svg',
    'windW.svg',
    'windW.svg',
    'windW.svg'];

  let dropdownList = document.getElementById(
    'dropdown-menu').children[0].children;
  Array.from(dropdownList).forEach(e => {
    if (e.id == layoutKey) e.className += ' is-active';
  });

  shuffleArray(pieces);

  let curPiece = 0;

  let hasPieces = true;
  while (hasPieces) {
    hasPieces = false;
    for (let colIndex = 0; colIndex < chosenLayout.length; colIndex++) {
      for (let rowIndex = 0; rowIndex < chosenLayout[colIndex].length;
           rowIndex++) {
        if (chosenLayout[colIndex][rowIndex] === 0) continue;
        hasPieces = true;
        if (Math.random() >= 0.5) continue;
        generatePiece(colIndex, rowIndex, pieces, curPiece);
        curPiece += 0.5;
      }
    }
  }

  if (!isGameWinnable()) newGame();
  chosenManually = false;

  checkAvailableMoves();
  timer('start');
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

  if (Array.from(allPieces).filter(piece => !piece.hidden).length !==
      0) return false;
  for (let piece of allPieces) piece.hidden = false;
  return true;
}

function checkGameState() {
  if (document.getElementsByClassName('piece').length === 2) {
    timer('end');
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
  let selectedDiv = document.createElement('div');
  selectedDiv.className = 'selected';

  selectedDiv.style.left = piece.style.left;
  selectedDiv.style.top = piece.style.top;
  selectedDiv.style.zIndex = Number.parseInt(piece.style.zIndex) + 1 + '';

  if (selected.length === 0) {  // Highlight selected piece
    selected.push(piece);

    piece.parentNode.appendChild(selectedDiv);

  } else if (selected[0] === piece) { // Deselect the currently chosen piece
    selected = [];

    Array.from(document.getElementsByClassName('selected')).
          forEach(i => i.remove());
  } else if (selected[0].innerHTML !== piece.innerHTML &&
             !selected[0].innerHTML.match(/f.*\.svg|seas.*\.svg/)) {
    // If the pieces are not the same, nor are they special ones select the new
    // one
    Array.from(document.getElementsByClassName('selected')).
          forEach(i => i.remove());

    piece.parentNode.appendChild(selectedDiv);

    selected[0] = piece;
  } else {

    if (selected[0].innerHTML.match(/f.*\.svg|seas.*\.svg/) &&
        (selected[0].innerHTML.match(/f.*\.svg/) &&
         !piece.innerHTML.match(/f.*\.svg/) ||
         selected[0].innerHTML.match(/seas.*\.svg/) &&
         !piece.innerHTML.match(/seas.*\.svg/))) {
      Array.from(document.getElementsByClassName('selected')).
            forEach(i => i.remove());
      piece.parentNode.appendChild(selectedDiv);

      selected[0] = piece;
      return;
    }

    // Remove selected pieces if they're of the same type && the move is legal
    // Completely delete the pieces after the 2nd move if they are still hidden
    if (lastMove.length === 2) {
      for (const piece of lastMove) {
        if (piece.hidden) {
          piece.remove();
        }
      }
    }
    Array.from(document.getElementsByClassName('selected')).
          forEach(i => i.remove());
    Array.from(document.getElementsByClassName('hint')).
          forEach(i => i.remove());

    // Save the last move for the undo button
    lastMove = [selected[0], piece];

    // Make sure the pieces won't still be selected after undo
    selected[0].hidden = true;
    piece.hidden = true;

    selected = [];
    checkAvailableMoves();
    undoButton.disabled = totalUndos <= 0;
  }

  checkGameState();
}

function load() {
  document.getElementById('loading-container').hidden = false;

  setTimeout(async () => {
    await createGame();
    document.getElementById('loading-container').hidden = true;
  }, 1);
}

function newGame() {

  load();

  selected = [];
  if (!chosenManually) {
    let layoutKeys = Object.keys(layouts);
    layoutKey = layoutKeys[Math.floor(Math.random() * layoutKeys.length)];

    let difficultyKeys = Object.keys(difficulties);
    difficultyKey = difficultyKeys[Math.floor(
      Math.random() * difficultyKeys.length)];
  }

  const grid = document.getElementById('game');
  for (const row of grid.children) {
    for (const col of row.children) {
      col.innerHTML = '';
    }
  }

  currentHints = totalHints;
  currentReshuffles = totalReshuffles;
  currentUndos = totalUndos;

  for (let child of
    document.getElementById('dropdown-menu').children[0].children) {
    child.className = child.className.replaceAll(' is-active', '');
  }
  for (let child of
    document.getElementById('dropdown-menu2').children[0].children) {
    child.className = child.className.replaceAll(' is-active', '');
  }

  calculateHelperValues();

}

let startTime;

function timer(action) {
  if (action == 'start') {
    startTime = new Date().getTime();
  }
  if (action == 'end') {
    let endTime = new Date().getTime(), timeDiff = endTime - startTime;
    timeDiff /= 1000;
    alert(timeDiff);
  }
}
