window.onload = () => createGame();

document.getElementById("new-game").addEventListener("click", newGame);


let selected = [];
let lastMove = [];
let availableMoves = [];
let totalHints = 5;
let currentHints = totalHints;

let hintButton = document.getElementById("hint");
hintButton.innerText = `Hint (${currentHints}/${totalHints})`;

let layouts = [// flower
  [
    [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 1], [0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0]
  ],

  // pyramid
  [
    [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 1, 2, 3, 2, 1, 0, 0],
    [1, 1, 2, 3, 4, 3, 2, 1, 1], [0, 0, 1, 2, 3, 2, 1, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0]
  ],

  // snake
  [
    [1, 2, 0, 1, 1, 2, 1, 1, 0], [1, 2, 0, 1, 2, 3, 2, 1, 0], [1, 3, 0, 1, 1, 4, 4, 1, 0], [1, 2, 0, 0, 0, 0, 3, 0, 0],
    [3, 2, 0, 0, 0, 1, 2, 3, 0], [0, 2, 0, 0, 0, 2, 0, 0, 0], [0, 2, 3, 0, 4, 3, 0, 0, 0], [0, 0, 3, 0, 4, 0, 0, 0, 0],
    [0, 0, 3, 3, 4, 0, 0, 0, 0]
  ]
];


let layoutNumber = 0;
let chosenLayout = 0;

document.getElementById("flower").addEventListener("click", () => {
  changeLayout(0);
});
document.getElementById("pyramid").addEventListener("click", () => {
  changeLayout(1);
});
document.getElementById("snake").addEventListener("click", () => {
  changeLayout(2);
});

document.getElementById("undo").addEventListener("click", () => {
  if (selected.length !== 0) {
    selected[0].className = "piece";
    selected = [];
  }
  lastMove[0].hidden = false;
  lastMove[1].hidden = false;
  checkAvailableMoves();
});

document.getElementById("hint").addEventListener("click", () => {
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
  chosenHint[0].className += " hint";
  chosenHint[1].className += " hint";

  setTimeout(() => {
    for (const piece of document.getElementsByClassName("piece")) {
      piece.className = piece.className.replace(" hint", "");
    }
    if (currentHints > 0) hintButton.disabled = false;
  }, 1500);
});

document.getElementById("reshuffle").addEventListener("click", () => {
  if (selected.length !== 0) {
    selected[0].className = "piece";
    selected = [];
  }

  //  https://stackoverflow.com/a/64457744/15403179
  let pieces = document.querySelectorAll(".piece:not([hidden])");


  for (let i = 0; i < pieces.length; i++) {
    let piece1 = pieces[i];

    //piece2 could be piece1. In that case, nothing changes
    let piece2 = pieces[Math.floor(Math.random() * pieces.length)];

    [
      piece1.style.cssText, piece2.style.cssText, piece1.id, piece2.id
    ] = [
      piece2.style.cssText, piece1.style.cssText, piece2.id, piece1.id
    ];
  }
  checkAvailableMoves();
});

function changeLayout(layoutNr) {
  document.getElementById("dropdown-menu").style.display = "none";
  layoutNumber = layoutNr;
  newGame();
}

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1
    ));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateGrid() {
  const grid = document.getElementById("game");
  for (let i = 0; i < layouts[layoutNumber].length; i++) {
    const row = document.createElement("div");
    row.className = "tile is-ancestor";
    for (let j = 0; j < layouts[layoutNumber][i].length; j++) {
      const col = document.createElement("div");
      col.className = "tile is-parent";
      row.appendChild(col);
    }
    grid.appendChild(row);
  }
}

function generatePiece(colIndex, rowIndex, pieces, curPiece, pieceWidth, pieceHeight) {
  let piecesOnPosition = chosenLayout[colIndex][rowIndex];
  let piece = document.createElement("div");
  piece.className = "piece";
  piece.id = "row: " + rowIndex + ", col: " + colIndex;
  piece.innerHTML = "<img src=\"img/Pieces/" + pieces[Math.floor(curPiece)] + "\" alt=\"Mahjong piece\">";
  piece.addEventListener("click", () => selectPieces(piece));
  piece.style.zIndex = chosenLayout.length * 100 - (rowIndex * 100
  ) + colIndex * 10 + piecesOnPosition;
  chosenLayout[colIndex][rowIndex]--;
  piece.style.width = `${pieceWidth}px`;
  piece.style.height = `${pieceHeight}px`;
  piece.style.left = `${colIndex * (0.77 * pieceWidth
  ) - (piecesOnPosition - 1
                        ) * 9}px`;
  piece.style.top = `${rowIndex * 0.84 * pieceHeight + (piecesOnPosition - 1
  ) * 7}px`;
  document.getElementById("game").children[colIndex].children[rowIndex].appendChild(piece);
}

function checkAvailableMoves() {
  availableMoves = [];
  let pieces = document.getElementsByClassName("piece");

  for (let piece of pieces) {
    let neighbourLeft, neighbourRight, maxHeight = piece.style.zIndex;

    for (const piece1 of pieces) {
      if (piece.hidden || piece1.hidden) continue;
      if (piece1 === piece) continue;

      let [rowLocationPiece, rowLocationPiece1] = [piece.id.indexOf("row: "), piece1.id.indexOf("row: ")];
      let [colLocationPiece, colLocationPiece1] = [piece.id.indexOf("col: "), piece1.id.indexOf("col: ")];
      let [commaLocationPiece, commaLocationPiece1] = [piece.id.indexOf(","), piece1.id.indexOf(",")];

      let [rowPiece, rowPiece1] = [
        Number.parseInt(piece.id.substring(rowLocationPiece + 5, commaLocationPiece)),
        Number.parseInt(piece1.id.substring(rowLocationPiece1 + 5, commaLocationPiece1))
      ];
      let [colPiece, colPiece1] = [
        Number.parseInt(piece.id.substring(colLocationPiece + 5)),
        Number.parseInt(piece1.id.substring(colLocationPiece1 + 5))
      ];

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

  let pieces = [
    "MJd1-.svg.png", "MJd2-.svg.png", "MJd3-.svg.png", "MJf1-.svg.png", "MJf2-.svg.png", "MJf3-.svg.png",
    "MJf4-.svg.png", "MJh1-.svg.png", "MJh2-.svg.png", "MJh3-.svg.png", "MJh4-.svg.png", "MJh5-.svg.png",
    "MJh6-.svg.png", "MJh7-.svg.png", "MJh8-.svg.png", "MJs1-.svg.png", "MJs2-.svg.png", "MJs3-.svg.png",
    "MJs4-.svg.png", "MJs5-.svg.png", "MJs6-.svg.png", "MJs7-.svg.png", "MJs8-.svg.png", "MJs9-.svg.png",
    "MJt1-.svg.png", "MJt2-.svg.png", "MJt3-.svg.png", "MJt4-.svg.png", "MJt5-.svg.png", "MJt6-.svg.png",
    "MJt7-.svg.png", "MJt8-.svg.png", "MJt9-.svg.png", "MJw1-.svg.png", "MJw2-.svg.png", "MJw3-.svg.png",
    "MJw4-.svg.png", "MJw5-.svg.png", "MJw6-.svg.png", "MJw7-.svg.png", "MJw8-.svg.png", "MJw9-.svg.png"
  ];

  document.getElementById("dropdown-menu").children[0].children[layoutNumber].className += " is-active";

  let pieceWidth = document.getElementById("game").offsetHeight / 1.2 / chosenLayout[0].length;
  let pieceHeight = document.getElementById("game").offsetHeight / chosenLayout.length;

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
  checkAvailableMoves();
}

function isGameWinnable() {
  let allPieces = document.getElementsByClassName("piece");
  checkAvailableMoves();

  for (let i = 0; i < allPieces.length; i++) {
    checkAvailableMoves();
    for (const piece of availableMoves) {
      for (const piece1 of availableMoves) {
        if (piece === piece1) continue;
        if (piece.innerHTML === piece1.innerHTML) {
          piece.hidden = true;
          piece1.hidden = true;
        }
      }
    }
  }

  if (Array.from(allPieces).filter(piece => !piece.hidden).length !== 0) return false;
  for (let piece of allPieces) piece.hidden = false;
  return true;
}

function checkGameState() {
  if (document.getElementsByClassName("piece").length === 2) {
    setTimeout(() => {
      alert("You won!");
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
        alert("You lost!");
      }, 100);
    }
  }
}

function selectPieces(piece) {
  if (!availableMoves.includes(piece)) return;
  if (selected.length === 0) {  // Highlight selected piece
    selected.push(piece);
    selected[0].className = "selected";
  } else if (selected[0] === piece) { // Deselect the currently chosen piece
    selected = [];
    piece.className = "piece";
  } else if (selected[0].innerHTML !== piece.innerHTML) { // If the pieces are not the same, select the new one
    selected[0].className = "piece";
    piece.className = "selected";
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
    selected[0].className = "piece";
    piece.className = "piece";
    selected[0].hidden = true;
    piece.hidden = true;

    selected = [];
    checkAvailableMoves();
  }

  checkGameState();
}

function newGame() {

  layoutNumber = Math.floor(Math.random() * layouts.length);

  const grid = document.getElementById("game");
  for (const row of grid.children) {
    for (const col of row.children) {
      col.innerHTML = "";
    }
  }

  currentHints = totalHints;
  hintButton.innerText = `Hint (${currentHints}/${totalHints})`;

  for (let child of document.getElementById("dropdown-menu").children[0].children) {
    child.className = child.className.replaceAll(" is-active", "");
  }


  createGame();
}
