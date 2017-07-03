Javascript Magic the Gathering simulator


AT THE BOTTOM OF game.js,
OR IN index.html (AFTER every other script):

  Just INSTANTIATE a game with TWO or more PLAYERS

var game = new Game([
  new Player("Darren", "0", 20, blueDeck), // currently the only decks are
  new Player("Tommy", "1", 20, greenDeck)  // blueDeck, and greenDeck
]);

AND EXECUTE startGame()

game.startGame();

player object description:
  Player("name", "index", "amountOfLife, "deck")

ToDo:
  1.Make Pool of Cards of Every Color,
    Build Player Decks based on Color parameter
  2.Add Instant Card Type
