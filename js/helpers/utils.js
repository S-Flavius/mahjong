// https://stackoverflow.com/a/48777893/15403179
let cursor = 0;
const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

export function konami(e) {
  cursor = (e.keyCode == KONAMI_CODE[cursor]) ? cursor + 1 : 0;
  if (cursor == KONAMI_CODE.length) document.getElementById('auto-move').disabled = false;
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

export function fillLayoutBuilder() {
  const layoutBuilder = document.getElementById('layout-builder');
  for (let i = 0; i < 8; i++) {
    const col = document.createElement('div');
    col.classList.add('container', 'columns');

    for (let j = 0; j < 10; j++) {
      const place = document.createElement('input');
      place.type = 'text';
      place.placeholder = '0';
      place.classList.add('column');

      place.addEventListener('click', () => {
        if (place.placeholder == 10) {
          place.style.border = `1px solid black`;
          place.classList.remove('black-placeholder');
          place.placeholder = '0';
        } else {
          place.placeholder = `${+place.placeholder % 10 + 1}`;
          place.style.border = `${place.placeholder}px solid #36d736`;
          place.classList.add('black-placeholder');
        }
      });

      place.addEventListener('change', () => {
        if (place.value == 0) {
          place.placeholder = 0 + '';
          place.value = '';
          place.style.border = `1px solid black`;
          place.classList.remove('black-placeholder');
        } else if (place.value) {
          place.placeholder = `${Math.min(9, place.value - 1)}`;
          place.click();
          place.value = '';
        }
      });
      col.appendChild(place);
    }
    layoutBuilder.appendChild(col);
  }
}

export const capitalize = (s) => s.toString().charAt(0).toUpperCase() + s.toString().slice(1);
