function Game(players){
  var self = this;
  this.gameOver = false;
  this.players = players;
  this.firstTurn =true;
  this.turns = 0;
  this.turnCounter = 0;
  this.UIWindow = document.createElement("div");
  this.buildUI = function (){
    for(var i = 0;i<this.players.length;i++){
      this.players[i].node = i;
      this.players[i].bNode = "b" +i;
      this.players[i].pNode = "p" +i;
      this.players[i].sNode = "s" +i;
      this.players[i].lNode = "l" +i;
      var container = document.createElement("div");
      var headline = document.createElement("div");
      var playerName = document.createElement("strong");
      playerName.appendChild(
        document.createTextNode(
          this.players[i].id));
      var lifeNode = document.createElement("span");
      var statusNode = document.createElement("span");
      var handNode = document.createElement("div");
      var battlefieldNode = document.createElement("div");
      var announcements = document.createElement("div");
      headline.id = "headline";
      lifeNode.id = ("l"+i);
      lifeNode.innerHTML = this.players[i].life;
      statusNode.id = ("s"+i);
      statusNode.className = "status";
      container.className = "row";
      handNode.id = ("p"+i);
      handNode.className = "col";
      battlefieldNode.id = ("b"+i);
      battlefieldNode.className = "col";
      announcements.className = "col";
      announcements.id = "announcements";

      playerName.appendChild(lifeNode);
      headline.appendChild(playerName);
      headline.appendChild(statusNode);
      container.appendChild(headline);
      container.appendChild(handNode);
      container.appendChild(battlefieldNode);
      this.UIWindow.appendChild(container);
    }
    container.appendChild(announcements);
    document.getElementById("UIWrapper").appendChild(this.UIWindow);
  }
  this.clearUI = function(){
    //Empty Status Divs
    var statuses = document.getElementsByClassName("status");
    for(i in statuses){statuses[i].innerHTML='';}
  }
  // DRAW SCREEN
  this.redrawScreen = function(){
    // EACH PLAYER
    for(var i = 0;i<this.players.length;i++){
      // Hands
      listNames("ol", this.players[i].pNode,this.players[i].hand);
      // Battlefield
      listNames("ol", this.players[i].bNode, this.players[i].battlefield.mana.concat(this.players[i].battlefield.creatures));
      // Player Life
      ih(this.players[i].lNode,this.players[i].life);
    }
  };
  this.write = function(toWrite){
    var announcements = document.getElementById("announcements");
    var allAnnouncements = document.querySelectorAll("#announcements span")
    var marginTop = 15;
    for(var i = 0;i<allAnnouncements.length;i++){
      // allAnnouncements[i].style.marginTop -= (i* marginTop);
      // cl(allAnnouncements[i])
    }
    var line = document.createElement("span");
    line.appendChild(document.createTextNode(toWrite));
    announcements.appendChild(line);
  };
  this.buildDecks = function(){
    //For Each Player in Game
    for(var j=0;j<this.players.length;j++){
      var newDeck = [];
      //Randomly Shuffle Creature Cards into Deck Array
      for(var i = 0; i <this.players[j].deck.cards.length;i++){
        var randIndex = getRandomInt(0,this.players[j].deck.cards.length);
        newDeck.push(new Creature(this.players[j].deck.cards[randIndex].type, this.players[j].deck.cards[randIndex].name,this.players[j].deck.cards[randIndex].power,this.players[j].deck.cards[randIndex].def, this.players[j].deck.cards[randIndex].cost));
        this.players[j].deck.cards.splice(randIndex, 1);
      };
      //Determine Mana Amount(1/2.5) and Shuffle them into Deck
      var manaAmount = Math.floor(newDeck.length / 2.5);
      for(var k=0; k< manaAmount;k++){
        var randIndex = getRandomInt(0, newDeck.length);
        newDeck.splice(randIndex, 0, new Mana(this.players[j].deck.colors[0]));
      }
      this.players[j].deck.cards = newDeck;
    }

  };
  this.getRandomPlayer = function(){
    return this.players[getRandomInt(0,this.players.length)];
  };
  this.checkDead = function(){
    for(var i = 0;i<this.players.length;i++){
      if(this.combatMessaging){cl(this.is+" DIED!");};
      this.players[i].isDead = (this.players[i].life <= 0) ? true : false;
    }
  };
  // Is Game Over
  this.isGameOver = function(){
    var livePlayers = [];
    for(var i =0;i<this.players.length;i++){
      if(!this.players[i].isDead){
        livePlayers.push(this.players[i]);
      }
    }
    if(livePlayers.length == 1){
      cl(this.players[this.turnCounter].id+" wins! The Game is Over.");
      this.gameOver = true;
    };
  };
  this.checkResetTurnCounter = function(){
    if(this.turnCounter >= this.players.length){
      this.turnCounter = 0;
    }
  };
  this.rotateTurnCounter = function(){
    this.turnCounter ++;
    this.checkResetTurnCounter();
    while(this.players[this.turnCounter].isDead){
      this.turnCounter ++;
      this.checkResetTurnCounter();
    }
  };
  // Game Turn
  this.turn = function(){
    // If Game, Rotate Turn Counter
    if(!game.gameOver){
      // Remove Outdated GUI
      this.clearUI();
      // Update Game Status
      this.turns ++;ih("gameStatus", this.turns);
      // Player Turn
      if(!this.players[this.turnCounter].isDead){
        // Player Turn
        this.players[this.turnCounter].turn(self);
      }
      // Dead Players?
      this.checkDead();
      // Game Over?
      this.isGameOver();
      // Rotate Next Turn
      this.rotateTurnCounter()
    }
  };
  //Starg Game
  this.startGame = function(){
    this.buildUI();
    this.buildDecks();
    //Each Player Draws Seven Cards
    for(var i = 0;i <7;i++){
      this.players.forEach(function(player){
        player.draw(self, true);
      });
    }

    // Random Player's First Turn Assignement
    this.turnCounter = getRandomInt(0,this.players.length);
    ih(("s"+this.turnCounter), "First Turn!");

    //Draw First Screen (No Round)
    this.redrawScreen();

    // this.loop();
  };
  this.loop = function (){

    while(this.gameOver == false){
      for(var i = 0;i<this.players.length;i++){
        this.players[this.turnCounter].turn(self);
        this.rotateTurnCounter()
        this.checkDead();
      };


      if(this.players.length == 1){
        cl(this.players[0].id+" wins! The Game is Over.");
        this.gameOver = true;
      }

    }//end while

  };
}
