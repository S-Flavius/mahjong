# Mahjong Solitaire (js)

Mahjong Solitaire is the classic Chinese game of Mahjong, also known as Shanghai Mahjong, computer Mahjong.

## How to play

For the time being, the game is hosted on my [GitHub page]( https://s-flavius.github.io/mahjong/)

The goal is to remove all the tiles from the board by matching pairs of free tiles. The free tiles are not covered and
have at least one side (left or right) exposed. Tiles can be matched by clicking on them in pairs. The game is over when
all pairs have been removed from the board or there are no exposed pairs remaining.

## Installation

Technically, you don't need anything to play the game.
Simply cloning the repository and opening the [index.html](index.html) in your browser of choice is enough to play
the game.

If you also want to save the user scores, you will need a [.env](.env) file in the root of your project.
Fill it using this template

```dotenv
IP =        # Database IP
USER =      # Database user
PASSWORD =  # Database password
PORT =      # Database port (default: 3306; project currently
            # works only with MySql)
DATABASE =  # Database name
```

If you would like to host the database in a Docker container, you can use the following commands to create it

```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -v mysql_data:/var/lib/mysql -d mysql:latest

# If you want to use a UI:
docker run --name myadmin -d --link mysql:db -p 8085:80 phpmyadmin

docker ps # to get the container id of the mysql container

# Connect to the container and create a database
docker exec -it $MYSQL_CONTAINER_ID mysql -uroot -p
```

And then in the container:

```sql
create database if not exists scores; # Same name as in .env file
```

To start the server, you will need to install the dependencies using `npm install` and then run `npm run server`.
This starts a simple express server that allows you to save or retrieve the scores from the database.

## Usage

- Sidebar
  - Layout
    - '+' : Add a new layout using the builder tool
    - '-' : Remove all custom made layouts
    - Refresh: retrieve the custom made layouts after reloading the page
    - Layouts: select a layout to play
  - Difficulty
    - Select the difficulty of the game
      - Easy: 100 hints, undos and reshuffles
      - Medium: 5 hints, 1 undo and reshuffle
      - Hard: 3 hints and no undos or reshuffles
      - EXTREME: no hints, undos or reshuffles
- Buttons
  - New Game: Start a new game
    - Default: randomly chooses a new difficulty and layout
  - Hint: Shows 2 pieces that can be clicked for 1.5 seconds
  - Undo: Undos the last move
  - Reshuffle: Reshuffles the board **without** checking if the game is still winnable
  - Auto move: Does one move automatically
  - Auto Shuffle: Reshuffles the board when losing, if reshuffles are available
- Timer
  - Current game time
    - White on the first game
    - Green if the current time is better than the last one
    - Red if the current time is worse than the last one
  - Last round
    - Appears just after completing a round, shows the time of the last round
- Win Modal
  - Optionally enter a username to save the score and submit with "submit"
  - Generate a new game
- Lose Modal
  - Undo a move (if undos are available)
  - Reshuffle the board (if reshuffles are available)
  - Generate a new game
- Layout builder
  - Optionally choose a name for the layout
  - Click or write in the tiles to create a layout
  - Click on the 'Add layout' button to save the layout
- Scores modal
  - Insert a username (looks for a pattern like '...{username}...' )
  - Choose a difficulty and layout
  - Click on 'Search' to retrieve the scores
  - Click on any of the table headers to sort the table

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
