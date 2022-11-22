import {
  clickablePieces,
  findAvailableMoves,
  konami,
  scrollOnSmallScreen,
  setClickable,
}                                      from './helpers/utils.js';
import {difficulties, layouts, pieces} from './layouts.js';

window.onload = () => {
  changeDifficulty(difficultyKey, false);
  changeLayout('Flower', false);
  scrollOnSmallScreen();
  newGame();
};

document.getElementById('new-game').addEventListener('click', newGame);

let selected = [];
let lastMove = [];
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

let layoutKey = 'Flower';
let chosenLayout = 0;
let difficultyKey = 'Easy';
let chosenManually = false;

function createElement(key) {
  let element = document.createElement('a');
  element.className = 'dropdown-item';
  element.id = key.toString();
  element.innerText = key.toString();
  return element;
}

for (let key in layouts) {
  // Adds the layouts to the layout dropdown menu
  let element = createElement(key);
  element.addEventListener('click', () => changeLayout(key));
  document.getElementById('dropdown-menu').children[0].appendChild(element);

  // Adds layout options to the option modal
  let option = document.createElement('option');
  option.innerHTML = `${key}`;
  document.getElementById('layout-selection').
           appendChild(option);
}

for (let key in difficulties) {
  // Adds the difficulties to the difficulty dropdown menu
  let element = createElement(key);
  element.addEventListener('click', () => changeDifficulty(key));
  document.getElementById('dropdown-menu2').children[0].appendChild(element);

  // Adds difficulty options to the option modal
  let option = document.createElement('option');
  option.innerHTML = `${key}`;
  document.getElementById('difficulty-selection').
           appendChild(option);
}





document.getElementById('undo').addEventListener('click', () => {
  undoButton.innerHTML = `<img class='undo-button'><p>(${--currentUndos}/${totalUndos})</p>`;
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
  // Update button text
  hintButton.innerHTML = `<img class='hint-button'/><p>(${--currentHints}/${totalHints})</p>`;

  // Check all the available moves
  let hints = [];
  for (let piece of clickablePieces) {
    if (piece.hidden) continue;
    for (let piece1 of clickablePieces) {
      if (piece1.hidden || piece === piece1) continue;
      if (piece.innerHTML === piece1.innerHTML) {
        hints.push([piece, piece1]);
      }
    }
  }

  // Select a random move out of the available ones
  let chosenHint = hints[Math.floor(Math.random() * hints.length)];

  // Create highlight location
  // REFACTORME: too much code
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

  // Highlight the pieces
  document.getElementById('game').appendChild(hintDiv);
  document.getElementById('game').appendChild(hintDiv1);

  // Disable button
  hintButton.disabled = true;

  // Remove highlight after 2.5 seconds
  setTimeout(() => {
    for (const piece of document.getElementsByClassName('piece')) {
      Array.from(document.getElementsByClassName('hint')).
            forEach(hint => hint.remove());
    }
    // Re-enable button if possible
    hintButton.disabled = currentHints <= 0;
  }, 2500);
});

document.getElementById('reshuffle').
         addEventListener('click', function reshuffle() {

           // Deselect all pieces
           if (selected.length !== 0) {
             selected[0].className = 'piece';
             selected = [];
           }

           //  https://stackoverflow.com/a/64457744/15403179
           // Get all the visible pieces
           let pieces = document.querySelectorAll('.piece:not([hidden])');

           // Go through each piece and swap it with another random one
           for (let i = 0; i < pieces.length; i++) {
             let piece1 = pieces[i];
             let piece2 = pieces[Math.floor(Math.random() * pieces.length)];

             if (piece1 === piece2) continue;

             // Swap the pieces, including their style
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
           // Check if possible moves still exist, otherwise reshuffle again
           // On 5 failed checks, alert the user and regenerate the board
           checkAvailableMoves();

           let curReshuffles = 0;
           let clickable = clickablePieces.filter(piece => !piece.hidden);
           if (clickable.length < 2) {
             curReshuffles++;

             if (curReshuffles > 5) {
               alert('No more moves available. You lose!');
               newGame();
             }
             reshuffle();
           }

           // Update button and disable if no more reshuffles are available
           reshuffleButton.innerHTML = `<img class='reshuffle-button'/><p>(${--currentReshuffles}/${totalReshuffles})</p>`;
           reshuffleButton.disabled = currentReshuffles <= 0;
         });

document.getElementById('auto-move').addEventListener('click', () => {
  let pairs = [];

  findAvailableMoves(pairs);
  // Simulate the player clicking the pieces, for better functionality with the
  // other functions
  for (const piece of pairs[Math.floor(Math.random() * pairs.length)]) {
    piece.click();
  }
});

// https://stackoverflow.com/a/48777893/15403179
document.addEventListener('keydown', konami);

function changeLayout(key, restart = true) {
  // Hides the layout dropdown menu
  document.getElementById('dropdown-menu').style.display = 'none';
  chosenManually = true;
  layoutKey = key;

  document.getElementById('game').style.width = `${(layouts[key].length *
                                                    75.5)}px`; // Piece width
                                                               // is 75.5px
  if (restart) newGame();
}

function changeDifficulty(key, restart = true) {
  // Hides the difficulty dropdown menu
  document.getElementById('dropdown-menu2').style.display = 'none';
  chosenManually = true;
  difficultyKey = key;

  if (restart) newGame();
}

function calculateHelperButtonValues() {

  // Resets currentHints and totalHints to the default values for the chosen
  // difficulty
  currentHints = totalHints = difficulties[difficultyKey]['hints'];
  currentReshuffles = totalReshuffles = difficulties[difficultyKey]['reshuffles'];
  currentUndos = totalUndos = difficulties[difficultyKey]['undos'];

  // Update the button text to reflect the new values
  hintButton.innerHTML = `<img class='hint-button'/><p>(${currentHints}/${totalHints})</p>`;
  reshuffleButton.innerHTML = `<img class='reshuffle-button'/><p>(${currentReshuffles}/${totalReshuffles})</p>`;
  undoButton.innerHTML = `<img class='undo-button'.><p>(${currentUndos}/${totalUndos})</p>`;

  // Disable the buttons if they are not available
  hintButton.disabled = totalHints <= 0;
  reshuffleButton.disabled = totalReshuffles <= 0;
  undoButton.disabled = true;

  // Highlight the selected difficulty
  Array.from(document.getElementById('dropdown-menu2').children[0].children).
        forEach(e => {
          if (e.id == difficultyKey) e.className += ' is-active';
        });
}

// https://stackoverflow.com/a/12646864
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function generateGrid() {

  // Generates a grid of empty spaces based on the chosen layout
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

  // Creates a piece with the correct image and position
  piece.className = 'piece';
  piece.id = 'row: ' + rowIndex + ', col: ' + colIndex;
  piece.innerHTML = `<img class='basePiece' src='img/Pieces/svg/basePiece.svg'>
  <img  class='pieceImage' src='img/Pieces/svg/${pieces[Math.floor(
    curPiece)]}'>`;
  piece.addEventListener('click', () => selectPieces(piece));
  piece.style.zIndex = chosenLayout.length * 100 - (rowIndex * 100) + colIndex *
                       10 + piecesOnPosition;
  chosenLayout[colIndex][rowIndex]--;
  piece.style.left = `${colIndex * 58.135 - 9 * piecesOnPosition + 9 +
                        chosenLayout.length * 7.55}px`;
  piece.style.top = `${rowIndex * 76.104 + 7 * piecesOnPosition + 8}px`;

  // Adds the piece to the grid
  document.getElementById(
    'game').children[colIndex].children[rowIndex].appendChild(piece);
}

function checkAvailableMoves() {
  setClickable([]);
  let pieces = document.getElementsByClassName('piece');

  for (let piece of pieces) {
    piece.className = 'piece';
    let neighbourLeft, neighbourRight, maxHeight = piece.style.zIndex;

    for (const piece1 of pieces) {
      if (piece.hidden || piece1.hidden) continue;
      if (piece1 === piece) continue;

      let [
            rowLocationPiece, rowLocationPiece1,
            colLocationPiece, colLocationPiece1,
            commaLocationPiece, commaLocationPiece1] = [
        piece.id.indexOf('row: '), piece1.id.indexOf('row: '),
        piece.id.indexOf('col: '), piece1.id.indexOf('col: '),
        piece.id.indexOf(','), piece1.id.indexOf(',')];

      let [rowPiece, rowPiece1] = [
        Number.parseInt(
          piece.id.substring(rowLocationPiece + 5, commaLocationPiece)),
        Number.parseInt(
          piece1.id.substring(rowLocationPiece1 + 5, commaLocationPiece1))];
      let [colPiece, colPiece1] = [
        Number.parseInt(piece.id.substring(colLocationPiece + 5)),
        Number.parseInt(piece1.id.substring(colLocationPiece1 + 5))];

      let [heightPiece, heightPiece1] = [
        piece.style.zIndex % 10, piece1.style.zIndex % 10];

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
    clickablePieces.push(piece);
    if (!piece.className.includes(
      'available')) piece.className += ' availableMove';
  }
}

async function createGame() {

  generateGrid();

  chosenLayout = JSON.parse(JSON.stringify(layouts[layoutKey]));

  Array.from(document.getElementById('dropdown-menu').children[0].children).
        forEach(e => {
          if (e.id === layoutKey) e.className += ' is-active';
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
    for (const piece of clickablePieces) {
      for (const piece1 of clickablePieces) {
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
    for (let piece of clickablePieces) {
      if (piece.hidden) continue;
      for (let piece1 of clickablePieces) {
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
  if (!clickablePieces.includes(piece)) return;
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

  calculateHelperButtonValues();

}

let startTime;

function timer(action) {
  if (action == 'start') {
    startTime = new Date().getTime();
  }
  if (action == 'end') {
    let endTime = new Date().getTime(), timeDiff = endTime - startTime;
    timeDiff /= 1000;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    if (confirm('Do you want to save your score?')) {
      let username = prompt('Enter your username to save your score');

      const raw = JSON.stringify({
                                   'username'  : username,
                                   'time'      : timeDiff,
                                   'layout'    : layoutKey,
                                   'difficulty': difficultyKey,
                                 });

      const requestOptions = {
        method  : 'POST',
        headers : myHeaders,
        body    : raw,
        redirect: 'follow',
      };

      fetch('http://localhost:3000/scores', requestOptions).
        then(response => response.text()).
        then(result => console.log(result)).
        catch(error => console.log('error', error));
    }
    alert(`time: ${timeDiff}`);
  }
}
