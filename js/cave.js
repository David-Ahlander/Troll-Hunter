(function () {
    function Cave(options) {
        options = options || {};
        this.pos = options.pos || [0, 0];
    }

    Cave.prototype = {
        sprite: new Sprite('img/cave.png', [0, 0], [210, 141])
    };

    Cave.prototype.midPos = function () {
        var posX = this.pos[0] + (this.sprite.size[0] / 2);
        var posY = this.pos[1] + (this.sprite.size[0] / 4);
        return [posX, posY];
    };

    window.Cave = Cave;
})();
