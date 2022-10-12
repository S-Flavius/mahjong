'use strict';

// noinspection DuplicatedCode

var wasMenu1Clicked = false;
var wasMenu2Clicked = false;

window.addEventListener('click', function () {

  if (wasMenu1Clicked) {
    wasMenu1Clicked = false;
    document.getElementById('dropdown-menu2').style.display = 'none';
    return;
  } else if (wasMenu2Clicked) {
    wasMenu2Clicked = false;
    document.getElementById('dropdown-menu').style.display = 'none';
    return;
  }

  document.getElementById('dropdown-menu').style.display = 'none';
  document.getElementById('dropdown-menu2').style.display = 'none';
});

document.getElementById('dropDownButton').addEventListener('click', function () {
  var dropDownMenu = document.getElementById('dropdown-menu');
  if (dropDownMenu.style.display === 'block') {
    dropDownMenu.style.display = 'none';
  } else {
    dropDownMenu.style.display = 'block';
  }
  wasMenu1Clicked = true;
});

document.getElementById('dropDownButton2').addEventListener('click', function () {
  var dropDownMenu = document.getElementById('dropdown-menu2');
  if (dropDownMenu.style.display === 'block') {
    dropDownMenu.style.display = 'none';
  } else {
    dropDownMenu.style.display = 'block';
  }

  wasMenu2Clicked = true;
});