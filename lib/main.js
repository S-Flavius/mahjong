'use strict';

// noinspection DuplicatedCode

document.getElementById('layout-title').addEventListener('click', function () {
  var layoutList = document.getElementById('layout-list');
  if (layoutList.style.maxHeight == '0px') {
    layoutList.style.maxHeight = '10000px';
    layoutList.firstElementChild.hidden = false;
  } else {
    layoutList.style.maxHeight = '0px';
    layoutList.firstElementChild.hidden = true;
  }
});

document.getElementById('difficulty-title').addEventListener('click', function () {
  var difficultyList = document.getElementById('difficulty-list');
  if (difficultyList.style.maxHeight == '0px') {
    difficultyList.style.maxHeight = '10000px';
    // difficultyList.firstElementChild.hidden = false;
  } else {
    difficultyList.style.maxHeight = '0px';
    // difficultyList.firstElementChild.hidden = true;
  }
});