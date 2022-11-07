```js
// Hints should work
// -- Checks if both highlighted elements are the same by clicking them
// -- and checking if they still exist

let rect0 = document.getElementsByClassName('hint')[0].getBoundingClientRect();
let rect1 = document.getElementsByClassName('hint')[1].getBoundingClientRect();
let p1 = document.elementFromPoint(rect0['left'] + rect0['width'] / 2,
                                   rect0['top'] + rect0['height'] / 2);
let p2 = document.elementFromPoint(rect1['left'] + rect1['width'] / 2, rect1['top'] + rect1['height'] / 2);
p1.click();
p2.click();
```

```js
// Undos should work
// -- Does a move
let available = document.getElementsByClassName('availableMove');
for (move of available) {
  if (move.innerHTML == available[0].innerHTML && move != available[0]) {
    move.click();
    available[0].click();
  }
}
```
