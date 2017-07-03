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
    this.tapped = true;
    toAttack.creatureDefending = toAttack.chooseDefendingCreature();
    //If Def. Creature exists
    if(toAttack.creatureDefending.length){
      toAttack.defend(self, battlefieldIndex, attackingOwner);
    }else{
      //Or Attack Player
      toAttack.life -= this.power;
      cl(toAttack.id+" got hit!");
    };
    //Redraw Defending Player Life
    ih(toAttack.lNode, toAttack.life);
  };
  this.defensiveAttack = function(attacker, attackerIndex, owner, attackingOwner){
    if(owner.creatureDefending[0].power >= attacker.life){
      attacker.life -= owner.creatureDefending[0].power;
      attackingOwner.battlefield.creatures.splice(attackerIndex, 1);
      cl(attacker.name+" dies! It has "+ attacker.life+" life.");
    }else{
      cl("The "+owner.creatureDefending[0].name+" is not strong enough to kill the "+attacker.name);
    }
  }
}
