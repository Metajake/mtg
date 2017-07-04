function Game(players){
  var self = this;
  this.gameOver = false;
  this.players = players;
  this.firstTurn =true;
  this.turns = 0;
  this.turnCounter = 0;
  // this.deck = [];
  this.buildUI = function (){
    var UIWindow = document.createElement("div");
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

      playerName.appendChild(lifeNode);
      headline.appendChild(playerName);
      headline.appendChild(statusNode);
      container.appendChild(headline);
      container.appendChild(handNode);
      container.appendChild(battlefieldNode);
      UIWindow.appendChild(container);
    }
    document.getElementById("UIContainer").appendChild(UIWindow);
  }
  this.clearUI = function(){
    //Empty Status Divs
    var statuses = document.getElementsByClassName("status");
    for(i in statuses){statuses[i].innerHTML='';}
  }
  this.redrawScreen = function(){
    for(var i = 0;i<this.players.length;i++){
      //Draw Hand
      listNames("ol", this.players[i].pNode,this.players[i].hand);
      //Draw Battlefield
      listNames("ol", this.players[i].bNode, this.players[i].battlefield.mana.concat(this.players[i].battlefield.creatures));
      //Draw Player Life
      ih(this.players[i].lNode,this.players[i].life);
    }
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
  this.checkDead = function(toCheck){
    for(var i = 0;i<this.players.length;i++){
      if(this.players[i].isDead()){
        this.players.splice(i,1);
      }
    };
  };
  this.rotateTurnCounter = function(){
    this.turnCounter ++;
    if(this.turnCounter == this.players.length){
      this.turnCounter = 0;
    }
  };
  this.turn = function(){
    this.clearUI();

    //Update Status
    this.turns ++;
    ih("gameStatus", this.turns);
    //Player Turn
    this.players[this.turnCounter].turn(self);
    //Check if Anyone dead
    this.checkDead();
    //Rotate Turn Counter
    this.rotateTurnCounter()
    //Check If Game Over
    if(this.players.length == 1){
      cl(this.players[0].id+" wins! The Game is Over.");
      this.gameOver = true;
    }
  };
  this.startGame = function(){
    this.buildUI();
    this.buildDecks();
    //Each Player Draws Seven Cards
    for(var i = 0;i <7;i++){
      this.players.forEach(function(player){
        player.draw(self, true);
      });
    }

    //Choose Random Player for First Turn
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
