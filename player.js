function Player(id, life, deck, messagingOn, combatMessaging){
  var self = this;
  this.messagingOn = messagingOn;
  this.combatMessaging = combatMessaging;
  this.id = id;
  this.node = undefined;
  this.bNode = undefined;
  this.pNode = undefined;
  this.sNode = undefined;
  this.lNode = undefined;
  this.deck = deck;
  this.life = life;
  this.isDead = false;
  this.hand = [];
  this.battlefield = {creatures:[],mana:[]};
  this.target = {};
  this.creaturesInCombat = [];
  this.creatureInCombat = [];
  this.creatureDefending = [];
  // this.checkDead = function(){
  //   if(this.combatMessaging){cl(this.is+" DIED!");};
  //   this.isDead = (this.life <= 0) ? true : false;
  // };
  this.damage = function(amount){
    if(this.combatMessaging){cl(this.id+" got hit!");};
    this.life -= amount;
  }
  this.draw = function(game, toMute){
    //Remove Top Card from the Deck, Add it to Hand
    if(deck.cards.length > 0){
      //If Unmuted Log Card Drawn
      if(!toMute){if(this.messagingOn){cl(this.id+" draws "+this.deck.cards[0].name);};};
      // Add Card to Hand
      this.hand.push(this.deck.cards[0]);
      // Remove Top Card from Deck
      this.deck.cards.shift();
    }else{
      if(this.messagingOn){cl(this.id+" has no cards left!");};
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
        if(this.messagingOn){cl(this.id+" plays "+this.hand[i].name)};
        this.battlefield.mana.push(this.hand[i]);
        this.hand.splice(i,1);
        return;
      }
    }
  };
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
          if(this.messagingOn){cl(this.id+ " summons "+this.hand[i].name);};
          this.battlefield.creatures.push(this.hand[i]);
          this.hand.splice(i,1);
          return;
        };
      };
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
  // TARGET other PLAYER
  this.chooseTarget = function(game){
    var potentialTarget = game.getRandomPlayer();

    // IS TARGET NOT SELF and NOT DEAD?
    while((potentialTarget.id == this.id) || potentialTarget.isDead){
      potentialTarget = game.getRandomPlayer();
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
    //NOTE ADD SOME LOGIG ABOUT CHOOSING ONE OR MORE ATTACKERS
    // var randIndex = getRandomInt(0,availableCreatures.length);
  }
  this.chooseDefendingCreature = function(){
    var untappedCreatures = [];
    //Look through Battlefield...
    for(var i =0;i <this.battlefield.creatures.length;i++){
      //If Creature is Untapped and Not already Defending,
      if(!this.battlefield.creatures[i].tapped && !this.battlefield.creatures[i].isDefending){
        //Create Array of Untapped, Undefending Creatures with their Battlefield Index
        untappedCreatures.push([this.battlefield.creatures[i],i]);
      }
    }
    //If an Available Defender Exist
    if(untappedCreatures.length){
      //NOTE Later, Instead of Random Creature, choose based on DEF
      var randIndex = getRandomInt(0,untappedCreatures.length)
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
        if(this.combatMessaging){cl(this.id+" attacks with "+this.creaturesInCombat[i][0].name+".");};
        this.creaturesInCombat[i][0].attack(this.target, this.creaturesInCombat[i][1], self);
      }
      this.target.resetDefendingCreatures();
    }
  }
  this.defend = function(attacking, attackerIndex, attackingOwner){
    if(this.combatMessaging){cl(this.id+" is defending with "+this.creatureDefending[0].name);};
    //Perform Defending Creature's Attack
    this.creatureDefending[0].defensiveAttack(attacking, attackerIndex, self, attackingOwner);
    if(attacking.power >= this.creatureDefending[0].life){
      this.creatureDefending[0].life -= attacking.power;
      this.battlefield.creatures.splice(this.creatureDefending[1], 1);
      if(this.combatMessaging){cl(this.creatureDefending[0].name+" dies! It has "+this.creatureDefending[0].life+" life.");};
    }else{
      if(this.combatMessaging){cl(attacking.name+" is defended against!");};
    }
  }
  // Creature on Second Round
  this.advanceSummonedCreatures = function(){
    for(var i = 0;i< this.battlefield.creatures.length;i++){
      this.battlefield.creatures[i].firstRound = false;
    }
  };
  this.turn = function(game){
    ih(this.sNode, "Taking Turn");
    if(this.messagingOn){
      cl(this.id+" is taking their turn.");
    };
    //Untap Mana, Creatures
    this.untapMana();
    this.untapCreatures();
    //Turn Off Game.firstTurn (so that players draw)
    if(game.firstTurn){
      game.firstTurn = false;
    }else{
      this.draw(game);
    }
    //Play Advance Creatures, Mana, Summon Creatures, Attack, Check if Dead
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
  this.resetDefendingCreatures = function(){
    for(var i=0;i<this.battlefield.creatures.length;i++){
      this.battlefield.creatures[i].isDefending = false;
    }
    this.creatureDefending = [];
  };
}
