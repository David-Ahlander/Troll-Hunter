(function(){
    function Player(pos){
       this.pos = pos;
    }   

    Player.prototype = {
        sprite: new Sprite('img/wizard2.png', [110, 0], [55, 55]),  
        moveSpeed: 300,
        attackSpeed: 300
    };

    Player.prototype.moveUp = function(dt){
        this.pos[1] -= this.moveSpeed * dt;
        this.sprite.pos[0] = 0;
    };

    Player.prototype.moveDown = function(dt){
        this.pos[1] += this.moveSpeed * dt;
        this.sprite.pos[0] = 55;
        
    };

    Player.prototype.moveLeft = function(dt){
        this.pos[0] -= this.moveSpeed * dt;
        this.sprite.pos[0] = 165;
    };

    Player.prototype.moveRight = function(dt){
        this.pos[0] += player.moveSpeed * dt;
        this.sprite.pos[0] = 110;
    };
    window.Player = Player;

})();
