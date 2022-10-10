'use strict';

document.getElementById('dropDownButton').addEventListener('click', function () {
  var dropDownMenu = document.getElementById('dropdown-menu');
  if (dropDownMenu.style.display === 'block') {
    dropDownMenu.style.display = 'none';
  } else {
    dropDownMenu.style.display = 'block';
  }
});
document.getElementById('dropDownButton2').addEventListener('click', function () {
  var dropDownMenu = document.getElementById('dropdown-menu2');
  if (dropDownMenu.style.display === 'block') {
    dropDownMenu.style.display = 'none';
  } else {
    dropDownMenu.style.display = 'block';
  }
});