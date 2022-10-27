```js
// Hints should work
//  -- Checks if both highlighted elements look the same

let rect0 = document.getElementsByClassName('hint')[0].getBoundingClientRect();
let rect1 = document.getElementsByClassName('hint')[1].getBoundingClientRect();
let p1Src = document.elementFromPoint(rect0['x'], rect0['y'] + 90).src;
let p2Src = document.elementFromPoint(rect1['x'], rect1['y']).src;
if (p1Src === p2Src) {
  Array.from(document.getElementsByClassName('hint')).forEach(p => p.remove())
}
```
