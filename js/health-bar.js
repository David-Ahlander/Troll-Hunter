(function() {
    function HealthBar(character, pos, size) {
        this.character = character;
        this.pos = pos;
        this.size = size;
    }

    HealthBar.prototype.render = function(ctx) {
        var posX = this.pos[0];
        var posY = this.pos[1];

        var width = this.size[0];
        var height = this.size[1];

        var health = this.character.hp / this.character.maxHp;

        ctx.lineWidth = 2;
        ctx.strokeRect(posX, posY, width, height);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(posX+1, posY+1,health*(width-2),height-2);
    }

    window.HealthBar = HealthBar;
})();
