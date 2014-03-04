(function() {
    /**
     * HealthBar
     *
     * @params {object} character  Character which will get a health bar.
     * @params {array}  pos        Contains x and y coordinates. Example: [x, y]
     * @params {array}  size       Contains with and height. Example: [width, height]
     */
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

        // Draw a box based on position, with and height with only borders.
        ctx.lineWidth = 2;
        ctx.strokeRect(posX, posY, width, height);

        // Draw a box inside the first one. If only 50% health left we only fill
        // 50% of the inner box with red color.
        ctx.fillStyle="#FF0000";
        ctx.fillRect(posX+1, posY+1,health*(width-2),height-2);
    }

    window.HealthBar = HealthBar;
})();
