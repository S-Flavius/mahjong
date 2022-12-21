export let layouts = {
  'flower': [[0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0], [1, 1, 1, 0, 0, 0, 1, 1, 1], [0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0]],
  'pyramid': [[0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 1, 2, 3, 2, 1, 0, 0], [1, 1, 2, 3, 4, 3, 2, 1, 1], [0, 0, 1, 2, 3, 2, 1, 0, 0], [0, 0, 1, 1, 2, 1, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0]],
  'snake': [[1, 2, 0, 1, 1, 2, 1, 1, 0], [1, 2, 0, 1, 2, 3, 2, 1, 0], [1, 3, 0, 1, 1, 4, 4, 1, 0], [1, 2, 0, 0, 0, 0, 3, 0, 0], [3, 2, 0, 0, 0, 1, 2, 3, 0], [0, 2, 0, 0, 0, 2, 0, 0, 0], [0, 2, 3, 0, 4, 3, 0, 0, 0], [0, 0, 3, 0, 4, 0, 0, 0, 0], [0, 0, 3, 3, 4, 0, 0, 0, 0]],
  'stairs': [[1, 1, 1, 2, 2, 2], [1, 1, 1, 2, 2, 2], [2, 2, 2, 3, 3, 3], [2, 2, 2, 3, 3, 3], [3, 3, 3, 4, 4, 4], [3, 3, 3, 4, 4, 4], [4, 4, 4, 5, 5, 5], [4, 4, 4, 6, 6, 6], [5, 5, 5, 7, 7, 7], [5, 5, 5, 7, 7, 8]],
  'mouse': [[0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 1, 2, 1, 0, 0, 0], [0, 0, 0, 0, 3, 0, 0, 0, 0], [0, 0, 1, 2, 3, 2, 1, 0, 0], [0, 1, 2, 3, 3, 3, 2, 1, 0], [0, 1, 2, 3, 4, 3, 2, 1, 0], [0, 1, 2, 3, 3, 3, 2, 1, 0], [0, 0, 1, 2, 3, 2, 1, 0, 0], [0, 0, 1, 2, 2, 2, 1, 0, 0], [0, 0, 0, 1, 2, 1, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 1, 2, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0]],
  'tortoise': [[1, 0, 0, 0, 0, 0, 0, 0, 1], [0, 1, 1, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 2, 2, 2, 2, 2, 0, 1], [0, 1, 2, 3, 3, 3, 2, 1, 0], [0, 0, 2, 2, 2, 2, 2, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 1, 1, 0], [1, 0, 0, 0, 0, 0, 0, 0, 1]],
  'test': [[0, 0, 0, 1, 1, 0, 0, 0], [0, 0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 2, 2, 1, 0, 0], [0, 0, 1, 2, 2, 1, 0, 0], [1, 1, 2, 3, 3, 2, 1, 1], [1, 1, 2, 3, 3, 2, 1, 1], [2, 2, 3, 4, 4, 3, 2, 2], [2, 2, 3, 4, 4, 3, 2, 2], [3, 3, 4, 5, 5, 4, 3, 3], [3, 3, 4, 5, 5, 4, 3, 3], [2, 2, 3, 4, 4, 3, 2, 2], [2, 2, 3, 4, 4, 3, 2, 2], [1, 1, 2, 3, 3, 2, 1, 1], [1, 1, 2, 3, 3, 2, 1, 1], [0, 0, 1, 2, 2, 1, 0, 0], [0, 0, 1, 2, 2, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0, 0], [0, 0, 0, 1, 1, 0, 0, 0]],
};

export let difficulties = {
  //difficulty : [Hints, reshuffles, undos]
  easy: {
    hints: 100, reshuffles: 100, undos: 100,
  }, medium: {
    hints: 5, reshuffles: 1, undos: 1,
  }, hard: {
    hints: 3, reshuffles: 0, undos: 0,
  }, expert: {
    hints: 0, reshuffles: 0, undos: 0,
  },
};

export let pieces = ['bamboo1.svg', 'bamboo1.svg', 'bamboo1.svg', 'bamboo1.svg', 'bamboo2.svg', 'bamboo2.svg', 'bamboo2.svg', 'bamboo2.svg', 'bamboo3.svg', 'bamboo3.svg', 'bamboo3.svg', 'bamboo3.svg', 'bamboo4.svg', 'bamboo4.svg', 'bamboo4.svg', 'bamboo4.svg', 'bamboo5.svg', 'bamboo5.svg', 'bamboo5.svg', 'bamboo5.svg', 'bamboo6.svg', 'bamboo6.svg', 'bamboo6.svg', 'bamboo6.svg', 'bamboo7.svg', 'bamboo7.svg', 'bamboo7.svg', 'bamboo7.svg', 'bamboo8.svg', 'bamboo8.svg', 'bamboo8.svg', 'bamboo8.svg', 'bamboo9.svg', 'bamboo9.svg', 'bamboo9.svg', 'bamboo9.svg', 'char1.svg', 'char1.svg', 'char1.svg', 'char1.svg', 'char2.svg', 'char2.svg', 'char2.svg', 'char2.svg', 'char3.svg', 'char3.svg', 'char3.svg', 'char3.svg', 'char4.svg', 'char4.svg', 'char4.svg', 'char4.svg', 'char5.svg', 'char5.svg', 'char5.svg', 'char5.svg', 'char6.svg', 'char6.svg', 'char6.svg', 'char6.svg', 'char7.svg', 'char7.svg', 'char7.svg', 'char7.svg', 'char8.svg', 'char8.svg', 'char8.svg', 'char8.svg', 'char9.svg', 'char9.svg', 'char9.svg', 'char9.svg', 'dot1.svg', 'dot1.svg', 'dot1.svg', 'dot1.svg', 'dot2.svg', 'dot2.svg', 'dot2.svg', 'dot2.svg', 'dot3.svg', 'dot3.svg', 'dot3.svg', 'dot3.svg', 'dot4.svg', 'dot4.svg', 'dot4.svg', 'dot4.svg', 'dot5.svg', 'dot5.svg', 'dot5.svg', 'dot5.svg', 'dot6.svg', 'dot6.svg', 'dot6.svg', 'dot6.svg', 'dot7.svg', 'dot7.svg', 'dot7.svg', 'dot7.svg', 'dot8.svg', 'dot8.svg', 'dot8.svg', 'dot8.svg', 'dot9.svg', 'dot9.svg', 'dot9.svg', 'dot9.svg', 'fBamboo.svg', 'fChrysanthemum.svg', 'fOrchid.svg', 'fPlum.svg', 'gDrag.svg', 'gDrag.svg', 'gDrag.svg', 'gDrag.svg', 'rDrag.svg', 'rDrag.svg', 'rDrag.svg', 'rDrag.svg', 'wDrag.svg', 'wDrag.svg', 'wDrag.svg', 'wDrag.svg', 'seasAutumn.svg', 'seasSpring.svg', 'seasSummer.svg', 'seasWinter.svg', 'windE.svg', 'windE.svg', 'windE.svg', 'windE.svg', 'windN.svg', 'windN.svg', 'windN.svg', 'windN.svg', 'windS.svg', 'windS.svg', 'windS.svg', 'windS.svg', 'windW.svg', 'windW.svg', 'windW.svg', 'windW.svg'];

export const importLayout = (title, layout) => {
  const layoutData = {[title]: layout};

  let currentLayouts = localStorage.getItem('layouts');

  try {
    currentLayouts = JSON.parse(currentLayouts || '{}');
  } catch (ignored) {
    currentLayouts = {};
  }

  Object.assign(currentLayouts, layoutData);
  localStorage.setItem('layouts', JSON.stringify(currentLayouts));
};

export const updateLayouts = () => {
  const localStorageLayouts = localStorage.getItem('layouts');

  if (typeof localStorageLayouts === 'string') {
    try {
      const parsedLayouts = JSON.parse(localStorageLayouts);
      Object.assign(layouts, parsedLayouts);
    } catch (ignored) {
    }
  }
};

export const removeLayout = (title) => {
  let currentLayouts = localStorage.getItem('layouts');

  try {
    currentLayouts = JSON.parse(currentLayouts || '{}');
  } catch (ignored) {
    currentLayouts = {};
  }

  delete layouts[title];
  delete currentLayouts[title];
  localStorage.setItem('layouts', JSON.stringify(currentLayouts));
};

