##Javascript Magic the Gathering simulator


**At the bottom** OF game.js,
**Or in** index.html *after every other script*

Instantiate a Game with **2** or more Players
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
