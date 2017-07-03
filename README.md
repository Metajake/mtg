## Javascript Magic the Gathering Simulator

### Download the project and open index.html

**At the bottom of** game.js **or in** index.html *after every other script*

Instantiate a Game with **2 - 3** Players
```javascript
var game = new Game([
  new Player("Darren", "0", 20, blueDeck), // currently the only decks are
  new Player("Tommy", "1", 20, greenDeck)  // blueDeck, and greenDeck
]);
```
And execute startGame()
```javascript
game.startGame();
```
**Player object description:**</br>
Player("name", "index", "amountOfLife, "deck")

**ToDo:**</br>
  0. Make Pool of Cards of Every Color,
  1. Build Player Decks based on Color parameter
  2. Add Instant Card Type
  4. Add Creature Card Abilities
