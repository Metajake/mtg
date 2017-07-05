function Creature(type, name, power, life, cost) {
  var self = this;
  this.type = type;
  this.name = name;
  this.power = power;
  this.life = life;
  this.cost = cost;
  this.firstRound = true;
  this.tapped = false;
  this.isDefending = false;
  this.readThing = function(toRead){ //MAKE PROTOTYPE
    return toRead;
  };
  this.attack = function(toAttack, battlefieldIndex, attackingOwner){
    //Tap This Creature
    this.tapped = true;
    //Select Defending Creature
    toAttack.creatureDefending = toAttack.chooseDefendingCreature();
    //If Targeted Player has Defensive Creature
    if(toAttack.creatureDefending.length){
      //Targeted Player Defends Attack
      toAttack.defend(self, battlefieldIndex, attackingOwner);
    }else{
      //Or Attack Player
      toAttack.damage(this.power);
    };
    //Redraw Defending Player Life
    ih(toAttack.lNode, toAttack.life);
  };
  this.defensiveAttack = function(attackingCreature, attackerIndex, owner, attackingOwner){
    if(owner.combatMessaging){cl(this.name+" attacks "+attackingCreature.name+" back!")};
    if(owner.creatureDefending[0].power >= attackingCreature.life){
      attackingCreature.life -= owner.creatureDefending[0].power;
      attackingOwner.battlefield.creatures.splice(attackerIndex, 1);
      if(owner.combatMessaging){cl(attackingCreature.name+" dies! It has "+ attackingCreature.life+" life.");};
    }else{
      if(owner.combatMessaging){cl("The "+owner.creatureDefending[0].name+" is not strong enough to kill the "+attackingCreature.name);};
    }
  }
}
