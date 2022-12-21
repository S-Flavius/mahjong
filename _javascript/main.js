// noinspection DuplicatedCode

document.getElementById('layout-title').addEventListener('click', (event) => {
  if (event.target.id === 'add-layout-button' || event.target.id === 'refresh-layout-list' || event.target.parent.id === 'refresh-layout-list' || event.target.id === 'remove-layouts') {
    return;
  }
  let layoutList = document.getElementById('layout-list');
  if (layoutList.style.maxHeight == '0px') {
    layoutList.style.maxHeight = '10000px';
    layoutList.firstElementChild.hidden = false;
  } else {
    layoutList.style.maxHeight = '0px';
    layoutList.firstElementChild.hidden = true;
  }
});

document.getElementById('difficulty-title').addEventListener('click', () => {
  let difficultyList = document.getElementById('difficulty-list');
  if (difficultyList.style.maxHeight == '0px') {
    difficultyList.style.maxHeight = '10000px';
    difficultyList.firstElementChild.hidden = false;
  } else {
    difficultyList.style.maxHeight = '0px';
    difficultyList.firstElementChild.hidden = true;
  }
});
