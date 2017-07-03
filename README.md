Javascript Magic the Gathering simulator


AT THE BOTTOM OF game.js,
OR IN index.html (AFTER every other script):

  Just INSTANTIATE a game with TWO or more PLAYERS
```javascript
var game = new Game([
  new Player("Darren", "0", 20, blueDeck), // currently the only decks are
  new Player("Tommy", "1", 20, greenDeck)  // blueDeck, and greenDeck
]);
```
AND EXECUTE startGame()
```javascript
game.startGame();
```
player object description:
  Player("name", "index", "amountOfLife, "deck")

ToDo:
  0. Make Pool of Cards of Every Color,
  1. Build Player Decks based on Color parameter
  2. Add Instant Card Type
  3. Add Creature Card Abilities
