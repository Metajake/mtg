## Javascript Magic the Gathering Simulator

To see it in action, visit http://jacobnorth.info/mtg/ or download and open index.html (make sure to open your browser console).

To begin, (at the **bottom** of setup.js or in index.html *after every other script*) instantiate a Game with **2 - 3** Players
```javascript
var game = new Game([
  new Player("Darren", "0", 20, blueDeck), // decks: whiteDeck, redDeck, blackDeck,
  new Player("Tommy", "1", 20, greenDeck)  // blueDeck, and greenDeck
]);
```
And execute startGame()
```javascript
game.startGame();
```
**Player object description:**</br>
Player("name", "index", "amountOfLife, "deck")

**ToDo:**
  * Make Console log
  * Selector Toggle Logging
  * Add Graveyard
  * Color Background Window for Attacking, Defending Players
  * Add Turn Step(s) for checking if Instant Cast
  * Defending Player choose Creature with highest defense
  * Add Instant Card Type (ex: fireball, cancel)
  * Activate Card's Neutral Mana Cost and Compare Neutral Cost to any Available Mana
  * Add Creature Card Abilities
  * Build Player Decks based on Color parameter
