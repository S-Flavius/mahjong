'use strict';

const closed = document.getElementById('closed');
const open = document.getElementById('open');
const spacingDiv = document.getElementById('spacing-div');
spacingDiv.style.setProperty('width', `${document.querySelector(
  '#closed').offsetWidth}px`);

open.hidden = true;

function opensMenu() {
  closed.style.setProperty('display', 'none');
  open.style.setProperty('display', 'block');

  spacingDiv.style.setProperty('width', `${document.querySelector(
    '#open').offsetWidth}px`);
}

function closesMenu() {
  closed.style.setProperty('display', 'flex');
  open.style.setProperty('display', 'none');
  spacingDiv.style.setProperty('width', `${document.querySelector(
    '#closed').offsetWidth}px`);
}

document.getElementById('open-img').addEventListener('click', opensMenu);
document.getElementById('close-img').addEventListener('click', closesMenu);
