# Mahjong Solitaire (js)

Mahjong Solitaire is the classic Chinese game of Mahjong, also known as Shanghai Mahjong, computer Mahjong.

## How to play

For the time being, the game is hosted on my [GitHub page]( https://s-flavius.github.io/mahjong/)

The goal is to remove all the tiles from the board by matching pairs of free tiles. The free tiles are not covered and
have at least one side (left or right) exposed. Tiles can be matched by clicking on them in pairs. The game is over when
all pairs have been removed from the board or there are no exposed pairs remaining.

## Usage

- Dropdowns
  - Layout: select the layout of the board
  - Difficulty: select the difficulty of the game
    - Easy: 100 hints, undos and reshuffles
    - Medium: 5 hints, 1 undo and reshuffle
    - Hard: 3 hints and no undos or reshuffles
    - EXTREME: no hints, undos or reshuffles
  - Theme: **TODO**


- Buttons
  - New Game: Start a new game
    - Default: randomly chooses a new difficulty and layout
  - Hint: Shows 2 pieces that can be clicked for 1.5 seconds
  - Undo: Undos the last move
  - Reshuffle: Reshuffles the board **without** checking if the game is still winnable

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
