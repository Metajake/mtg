////////////////////////////////////////////////////////////
      var runButton = document.getElementById("turn");
      runButton.onclick = function(){
        game.turn();
      };
      function ih(logTo, toLog){
        document.getElementById(logTo).innerHTML = toLog;

      }

      function listNames(listType, listTo, toList){
        var listTo = document.getElementById(listTo);
        var list = document.createElement(listType);
        while(listTo.hasChildNodes()){
          listTo.removeChild(listTo.firstChild);
        }
        for(var i=0; i<toList.length;i++){
          var item = document.createElement("li");
          item.appendChild(document.createTextNode(toList[i].name+" "+toList[i].tapped));
          list.appendChild(item);
        }
        listTo.appendChild(list);
      }

      function cl(toLog){
        console.log(toLog);
      }
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
      }
      function areDead(pool){
        var dead = false;
        pool.forEach(function(card){
          if(card.life <= 0){
            dead = true;
          };
        });
        return dead;
      }

///////////////////////////////////////////////////////////

      function Mana(type, isTapped){
        this.type = "mana";
        this.manaType = type;
        this.name = type + " mana";
        this.tapped = isTapped ? true : false;
      }

////////////////////////////////////////////////////////////

      var game = new Game([
        new Player("Darren", 20, blueDeck,false,true),
        new Player("Tommy", 20, redDeck,false,true),
        new Player("Jacob", 20, blackDeck,false,true),
        new Player("Joanna", 20, greenDeck,false,true),
        new Player("Glenn", 20, whiteDeck,false,true)
      ]);

////////////////////////////////////////////////////////////

      game.startGame();

////////////////////////////////////////////////////////////
