(function(){
    function Player(pos){
       this.pos = pos;
    }   

    Player.prototype = {
        sprite: new Sprite('img/wizard2.png', [110, 0], [55, 55])
    };

    window.Player = Player;

})();
