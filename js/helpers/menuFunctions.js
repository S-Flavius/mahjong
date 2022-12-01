'use strict';

let closed = document.getElementById('closed');
let open = document.getElementById('open');

open.hidden = true;

function opensMenu() {
  closed.style.setProperty('display', 'none');
  open.style.setProperty('display', 'block');
  let spacingDiv = document.createElement('div');
  spacingDiv.style.setProperty('width',
                               document.querySelector('#open > h1').width);
  document.getElementById('brand').prepend(spacingDiv);
}

function closesMenu() {
  closed.style.setProperty('display', 'flex');
  open.style.setProperty('display', 'none');
}

document.getElementById('open-img').addEventListener('click', opensMenu);
document.getElementById('close-img').addEventListener('click', closesMenu);
