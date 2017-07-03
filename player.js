function Player(id, node, life, deck){
  var self = this;
  this.id = id;
  this.bNode = "b" +node;
  this.pNode = "p" +node;
  this.sNode = "s" +node;
  this.lNode = "l" +node;
  this.deck = deck;
  this.life = life;
  this.hand = [];
  this.battlefield = {creatures:[],mana:[]};
  this.target = {};
  this.creaturesInCombat = [];
  this.creatureInCombat = [];
  this.creatureDefending = [];
  this.isDead = function(){
    return (this.life <= 0) ? true : false;
  };
  this.draw = function(game){
    //Remove Top Card from the Deck, Add it to Hand
    if(deck.cards.length > 0){
      this.hand.push(this.deck.cards[0]);
      this.deck.cards.shift();
    }else{
      cl("there are no cards left!");
    }
    listNames("ol", this.pNode, this.hand);
  };
  this.untapMana = function(){
    for(var i=0;i<this.battlefield.mana.length;i++){
      this.battlefield.mana[i].tapped = false;
    }
  }
  this.untapCreatures = function(){
    for(var i=0;i<this.battlefield.creatures.length;i++){
      this.battlefield.creatures[i].tapped = false;
    }
  }
  this.playMana = function(){
    for(var i = 0; i<this.hand.length;i++){
      if(this.hand[i].type == "mana"){
        this.battlefield.mana.push(this.hand[i]);
        this.hand.splice(i,1);
        return;
      }
    }
  };
  this.getUntappedMana = function(){
    var mana = {gr:0,blk:0,blu:0,n:0,wh:0,rd:0};
    for(var i=0;i<this.battlefield.mana.length;i++){
      if(this.battlefield.mana[i].tapped == false){
        mana[this.battlefield.mana[i].manaType] ++;
      }
    }
    return mana;
  }
  this.summonCreature = function(){
    //Look through Cards in Hand
    for(var i=0;i<this.hand.length;i++){
      //If Card is a Creature
      if(this.hand[i].type == "creature"){ //DECOUPLE THIS TO ROUND STATE LOGIC
        //Compare Cost of Card to Mana
        if(this.compareCost(this.hand[i])){
          //Tap Mana Used to Summon
          for(type in this.hand[i].cost){
            for(var j=0;j<this.hand[i].cost[type];j++){
              this.battlefield.mana[j].tapped = true;
            }
          }
          cl(this.id+ " summons "+this.hand[i].name);
          this.battlefield.creatures.push(this.hand[i]);
          this.hand.splice(i,1);
          return;
        };
      };
    }
  };
  this.compareCost = function(toCompare){
    var cost;
    var availableMana = {};
    var untappedMana = this.getUntappedMana();

    for(type in toCompare.cost){
      if(toCompare.cost.hasOwnProperty(type)){
        if(untappedMana[type] < toCompare.cost[type]){
          return false;
        }
      }
    };
    return true;
  };
  this.chooseTarget = function(game){
    // Return Player to Attack
    var potentialTarget = game.players[getRandomInt(0,game.players.length)];
    while(potentialTarget.id == this.id){
      potentialTarget = game.players[getRandomInt(0,game.players.length)];
    }
    return potentialTarget;
  }
  this.chooseAttackers = function(){
    //Look At All Creatures On Battlefield
    for(var i =0;i <this.battlefield.creatures.length;i++){
      //IF Creature isn't on his First Round and Is Not Tapped and it has Power greater than Zero
      if(
        !this.battlefield.creatures[i].firstRound &&
        !this.battlefield.creatures[i].tapped &&
        this.battlefield.creatures[i].power > 0
      ){
        //Add it to this temporary Array
        this.creaturesInCombat.push([this.battlefield.creatures[i],i]);
      }
    };
    //LATER ADD SOME LOGIG ABOUT CHOOSING ONE OR MORE ATTACKERS
    // var randIndex = getRandomInt(0,availableCreatures.length);
  }
  this.chooseDefendingCreature = function(){
    var untappedCreatures = [];
    //Look through Battlefield...
    for(var i =0;i <this.battlefield.creatures.length;i++){
      if(!this.battlefield.creatures[i].tapped && !this.battlefield.creatures[i].isDefending){
        //Create Array of Untapped, Undefending Creatures and their Battlefield Index
        untappedCreatures.push([this.battlefield.creatures[i],i]);
      }
    }
    //If an Available Defender Exist
    if(untappedCreatures.length){
      //note: Later, Instead of Random Creature, choose based on DEF
      var randIndex = getRandomInt(0,untappedCreatures.length)
      cl("Defending with: "+ untappedCreatures[randIndex][0].name);
      this.battlefield.creatures[untappedCreatures[randIndex][1]].isDefending = true;
      return [untappedCreatures[randIndex][0],untappedCreatures[randIndex][1]];
    }else{return [];}
  };
  this.attack = function(game){
    //Get Array of Creatures who Can Attack and their Battlefield Index
    this.chooseAttackers();
    //If There Are Any Attackers...
    if(this.creaturesInCombat.length){
      //Choose Target Player
      this.target = this.chooseTarget(game);
      //Attack With Each Attacking Creature
      for(var i = 0;i<this.creaturesInCombat.length;i++){
        cl(this.id+" attacks with "+this.creaturesInCombat[i][0].name+".")
        this.creaturesInCombat[i][0].attack(this.target, this.creaturesInCombat[i][1], self);
      }
      this.target.resetDefendingCreatures();
    }else{
      cl("nothing to attack with");
    }
  }
  this.defend = function(attacking, attackerIndex, attackingOwner){
    if(attacking.power >= this.creatureDefending[0].life){
      this.creatureDefending[0].life -= attacking.power;
      this.battlefield.creatures.splice(this.creatureDefending[1], 1);
      cl(this.creatureDefending[0].name+" dies! It has "+this.creatureDefending[0].life+" life.");
    }else{
      cl(attacking.name+" is defended against!");
      this.creatureDefending[0].defensiveAttack(attacking, attackerIndex, self, attackingOwner);
    }
  }
  this.advanceSummonedCreatures = function(){
    for(var i = 0;i< this.battlefield.creatures.length;i++){
      this.battlefield.creatures[i].firstRound = false;
    }
  };
  this.turn = function(game){
    cl(this.id+" is taking their turn.");
    //Untap Mana, Creatures
    this.untapMana();
    this.untapCreatures();
    //Turn Off Game.firstTurn (so that players draw)
    if(game.firstTurn){
      game.firstTurn = false;
    }else{
      this.draw(game);
    }
    //Play Advance Creatures, Mana, Summon Creatures, Attack
    this.advanceSummonedCreatures();
    this.playMana();
    this.summonCreature();
    this.attack(game);

    //Empty Attacking Creatures In Combat
    this.creaturesInCombat=[];
    this.target = {};
    //Update UI
    game.redrawScreen();
  }
  this.resetDefendingCreatures = function(){
    for(var i=0;i<this.battlefield.creatures.length;i++){
      this.battlefield.creatures[i].isDefending = false;
    }
    this.creatureDefending = [];
  };
}
