(function(){
    function Player(pos){
       this.pos = pos;
    }

    Player.prototype = {
        sprite: new Sprite('img/wizard2.png', [110, 0], [55, 55]),  
        moveSpeed: 300,
        attackSpeed: 300,
        bomb: null
    };

    window.Player = Player;

})();
