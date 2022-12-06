import {
  clickablePieces,
  findAvailableMoves,
  konami,
  scrollOnSmallScreen,
  setClickable,
}                                      from './helpers/utils.js';
import {difficulties, layouts, pieces} from './layouts.js';
import {lang}                          from './intl/languages/lang.js';

window.onload = () => {
  changeDifficulty('easy', false);
  changeLayout('flower', false);
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
let language = 'en';

let hintButton = document.getElementById('hint');
hintButton.innerHTML = ``;

let reshuffleButton = document.getElementById('reshuffle');
reshuffleButton.innerHTML = ``;

let undoButton = document.getElementById('undo');
undoButton.innerHTML = ``;
undoButton.disabled = true;

document.getElementById('german-flag').
         addEventListener('click', () => changeLanguage('de'));
document.getElementById('usa-flag').
         addEventListener('click', () => changeLanguage('en'));

const autoMoveButton = document.getElementById('auto-move');

function changeLanguage(newLanguage) {
  language = newLanguage;
  document.getElementById(
    'layout-title').innerText = lang[language]['layout'];
  document.getElementById(
    'difficulty-title').innerText = lang[language]['difficulty'];

  autoMoveButton.innerHTML = lang[language]['autoMove'];
  document.getElementById('new-game').innerHTML = lang[language]['newGame'];
  document.getElementById(
    'show-scores').innerHTML = lang[language]['showScores'];

  fillDropDowns();
}

let layoutKey = 'flower';
let chosenLayout = 0;
let difficultyKey = 'easy';
let chosenManually = false;

function createElement(key, className) {
  let element = document.createElement('li');
  element.innerHTML = `<a>${lang[language][key] ?
                            lang[language][key] :
                            key.toString().charAt(0).toUpperCase() +
                            key.toString().slice(1)}</a>`;
  element.className = className;
  element.id = key.toString();

  return element;
}

function fillDropDowns() {
  let lists = document.querySelectorAll(
    '#layout-components,#difficulty-components');

  for (const list of lists) {
    while (list.firstChild) {
      list.firstChild.remove();
    }
  }

  for (let key in layouts) {
    // Adds the layouts to the layout dropdown menu
    let element = createElement(key, 'layout');
    element.addEventListener('click', () => changeLayout(key));
    document.getElementById('layout-components').appendChild(element);

    // Adds layout options to the option modal
    let option = document.createElement('option');
    option.innerHTML = `${lang[language][key]}`;
    document.getElementById('layout-selection').
             appendChild(option);
  }

  for (let key in difficulties) {
    // Adds the difficulties to the difficulty dropdown menu
    let element = createElement(key, 'difficulty');
    element.addEventListener('click', () => changeDifficulty(key));
    document.getElementById('difficulty-components').appendChild(element);

    // Adds difficulty options to the option modal
    let option = document.createElement('option');
    option.innerHTML = `${lang[language][key]}`;
    document.getElementById('difficulty-selection').
             appendChild(option);
  }
}

fillDropDowns();

document.getElementById('undo').addEventListener('click', undo);

function undo() {
  undoButton.innerHTML = `<img class='undo-button'><p>(${--currentUndos}/${totalUndos})</p>`;
  if (selected.length !== 0) {
    selected[0].className = 'piece';
    selected = [];
  }
  lastMove[0].hidden = false;
  lastMove[1].hidden = false;
  checkAvailableMoves();
  undoButton.disabled = true;
}

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

autoMoveButton.addEventListener('click', () => {
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
  chosenManually = true;
  layoutKey = key;

  document.getElementById('game').style.width = `${(layouts[key].length *
                                                    75.5)}px`; // Piece width
                                                               // is 75.5px
  document.getElementById('game').style.height =
    `${layouts[key][0].length * 77 + 50}px`;
  if (restart) newGame();
}

function changeDifficulty(key, restart = true) {
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
  Array.from(document.querySelectorAll('.difficulty')).
        forEach(e => {
          if (e.id === difficultyKey) e.firstElementChild.classList.add(
            'is-active');
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
  }
}

async function createGame() {

  generateGrid();

  chosenLayout = JSON.parse(JSON.stringify(layouts[layoutKey]));

  Array.from(document.querySelectorAll('.layout')).
        forEach(e => {
          if (e.id === layoutKey) e.firstElementChild.classList.add(
            'is-active');
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
    hintButton.disabled = true;
    undoButton.disabled = true;
    reshuffleButton.disabled = true;
    autoMoveButton.disabled = true;

    setTimeout(() => {
      timer('end');
      const submitWinButton = document.getElementById('modal-win-submit');
      submitWinButton.disabled = false;

      document.getElementById('modal-win').classList.add('is-active');
      document.getElementById('modal-win-time').innerHTML = new Date(
        new Date() - startTime).toISOString().substring(14, 19);
      submitWinButton.addEventListener('click', () => {
        submitScore();
        submitWinButton.disabled = true; // Prevents submitting multiple times
      });
      document.getElementById('modal-win-new-game').
               addEventListener('click', () => {
                 chosenManually = true;
                 newGame();
                 document.getElementById('modal-win').
                          classList.
                          remove('is-active');
               });

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
        timer('end');
        document.getElementById('modal-lose').classList.add('is-active');
        document.getElementById('modal-lose-time').innerHTML = new Date(
          new Date() - startTime).toISOString().substring(14, 19);
        if (currentUndos > 0) {
          document.getElementById('modal-lose-undo').
                   addEventListener('click', () => {
                     undo();
                     document.getElementById('modal-lose').
                              classList.
                              remove('is-active');
                   });
        } else {
          document.getElementById('modal-lose-undo').disabled = true;
        }
        document.getElementById('modal-lose-new-game').
                 addEventListener('click', () => {
                   newGame();
                   document.getElementById('modal-lose').
                            classList.
                            remove('is-active');
                 });
      });

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
    // If the pieces are not the same, nor are they special ones select the
    // new one
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

    // Remove selected pieces if they're of the same type && the move is
    // legal
    // Completely delete the pieces after the 2nd move if they are still
    // hidden
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
    undoButton.disabled = currentUndos <= 0;
  }

  checkGameState();
}

function load() {

  setTimeout(async () => {
    await createGame();
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

  for (let element of document.querySelectorAll(
    '.layout, .difficulty')) element.firstElementChild.classList.remove(
    'is-active');

  calculateHelperButtonValues();
}

let startTime;
let endTime;
let runningTimer;

function submitScore() {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
                               'username'  : document.getElementById(
                                 'modal-win-username').value,
                               'time'      : endTime / 1000,
                               'layout'    : layoutKey,
                               'difficulty': difficultyKey,
                             });

  const requestOptions = {
    method  : 'POST',
    headers : myHeaders,
    body    : raw,
    redirect: 'follow',
  };

  fetch('http://localhost:3000/score', requestOptions).
    then(response => response.text()).
    catch(error => console.log('error', error));

}

function timer(action) {
  if (action == 'start') {
    document.querySelector('#current-time').innerHTML = '00:00';
    startTime = new Date();
    runningTimer = setInterval(() => {
      let time = new Date(new Date() - startTime);
      document.querySelector('#current-time').innerHTML =
        time.toISOString().substring(14, 19);

      if (endTime) {
        document.querySelector('#current-time').style.color = endTime -
                                                              time >=
                                                              0 ?
                                                              'green' :
                                                              'red';
      }
    }, 1000);
  } else if (action == 'end') {
    clearInterval(runningTimer);

    document.querySelector('#old-time').style.visibility = 'visible';

    endTime = new Date(new Date() - startTime);

    const neededTime = new Date(endTime);
    document.querySelector('#old-time').innerHTML =
      neededTime.toISOString().substring(14, 19);
    document.querySelector('#current-time').innerHTML;
    document.querySelector('#current-time').innerHTML = '00:00';

  }
}
