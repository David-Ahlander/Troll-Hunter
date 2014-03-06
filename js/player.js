(function(){
    function Player(pos){
       this.pos = pos;
    }

    Player.prototype = {
        sprite: new Sprite('img/wizard2.png', [110, 0], [55, 55]),  
        moveSpeed: 300,
		bomb: null,
        attackSpeed: 400
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
        this.pos[0] += this.moveSpeed * dt;
        this.sprite.pos[0] = 110;
    };

    Player.prototype.pointedAt= function(){
            var direction;

            switch(this.sprite.pos[0]) {
                case 55:
                direction = 'down'; break;
                case 0:
                direction = 'up'; break;
                case 165:
                direction = 'left'; break;
                case 110:
                direction = 'right'; break;
            }
            return direction;
    };

    window.Player = Player;

})();
