// https://stackoverflow.com/a/48777893/15403179
let cursor = 0;
const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

export function konami(e) {
  cursor = (e.keyCode == KONAMI_CODE[cursor]) ? cursor + 1 : 0;
  if (cursor == KONAMI_CODE.length) document.getElementById(
    'auto-move').disabled = false;
}

export function scrollOnSmallScreen() {
  if (window.innerHeight < 800) {
    document.getElementsByClassName('navbar')[0].style.display = 'none';

    setTimeout(() => {
      window.scroll({
                      top: 10, behavior: 'smooth',
                    });
    }, 200);
  }
}

export let clickablePieces = [];

export function setClickable(value) {
  clickablePieces = value;
}

export function findAvailableMoves(pairs) {

  for (const piece of clickablePieces) {
    for (const piece1 of clickablePieces) {
      if (piece.hidden || piece1.hidden) continue;
      if (piece === piece1) continue;
      if (piece.innerHTML === piece1.innerHTML) {
        pairs.push([piece, piece1]);
      }
    }
  }
}
